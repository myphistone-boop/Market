"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useKnowledgeStore } from "@/store/useKnowledgeStore";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ChatMessage {
  id: string;
  type: "user" | "system" | "info";
  text: string;
  timestamp: Date;
  nodeCreated?: {
    title: string;
    domainName: string;
    domainColor: string;
    tags: string[];
    connections: number;
    importance: number;
  };
}

// ---------------------------------------------------------------------------
// Parsing helpers
// ---------------------------------------------------------------------------

const domainKeywords: Record<string, string[]> = {
  execution: [
    "execution", "exécution", "ordre", "order", "routing", "route",
    "SOR", "algo", "algorithme", "venue", "DMA", "VWAP", "TWAP",
    "carnet", "book", "matching", "latence", "fix", "protocol",
  ],
  clearing: [
    "clearing", "compensation", "settlement", "règlement", "livraison",
    "CCP", "contrepartie", "marge", "margin", "T+1", "T+2", "DVP",
    "CSD", "dépositaire", "euroclear", "clearstream", "netting",
    "novation", "fail", "CSDR",
  ],
  revenue: [
    "revenue", "revenu", "commission", "courtage", "spread",
    "rémunération", "CSA", "unbundling", "monétisation", "fee",
    "tarif", "pricing", "modèle économique", "marge",
  ],
  costs: [
    "coût", "cost", "frais", "dépense", "maker-taker", "maker",
    "taker", "rebate", "co-location", "infrastructure", "capex",
    "opex", "technologie", "data", "données de marché",
  ],
  regulation: [
    "régulation", "regulation", "réglementaire", "MiFID", "MiFIR",
    "compliance", "conformité", "reporting", "AMF", "ESMA",
    "best execution", "transparence", "RTS", "directive", "DORA",
    "EMIR", "SFTR",
  ],
  research: [
    "research", "recherche", "analyste", "analyst", "couverture",
    "coverage", "note", "recommandation", "buy", "sell", "hold",
    "objectif de cours", "roadshow", "morning meeting",
  ],
  clients: [
    "client", "buy-side", "buyside", "sell-side", "sellside",
    "sales", "trading", "asset manager", "hedge fund", "assureur",
    "institutionnel", "retail", "flow", "lifecycle", "relation",
  ],
};

function detectDomain(text: string, explicitDomain: string | null): string {
  if (explicitDomain) return explicitDomain;

  const lower = text.toLowerCase();
  let bestDomain = "execution";
  let bestScore = 0;

  for (const [domain, keywords] of Object.entries(domainKeywords)) {
    let score = 0;
    for (const kw of keywords) {
      if (lower.includes(kw.toLowerCase())) {
        score += kw.length; // longer keywords = more specific = higher weight
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestDomain = domain;
    }
  }
  return bestDomain;
}

function extractExplicitDomain(text: string): { domain: string | null; cleaned: string } {
  const match = text.match(/@(\w+)/);
  if (match) {
    const domainId = match[1].toLowerCase();
    // Check if it matches a known domain
    if (Object.keys(domainKeywords).includes(domainId)) {
      return { domain: domainId, cleaned: text.replace(match[0], "").trim() };
    }
    // Try partial match
    for (const key of Object.keys(domainKeywords)) {
      if (key.startsWith(domainId) || domainId.startsWith(key.slice(0, 4))) {
        return { domain: key, cleaned: text.replace(match[0], "").trim() };
      }
    }
  }
  return { domain: null, cleaned: text };
}

function extractHashtags(text: string): { tags: string[]; cleaned: string } {
  const hashtagRegex = /#([\w-]+)/g;
  const tags: string[] = [];
  let match;
  while ((match = hashtagRegex.exec(text)) !== null) {
    tags.push(match[1]);
  }
  const cleaned = text.replace(hashtagRegex, "").trim();
  return { tags, cleaned };
}

function detectImportance(text: string): number {
  const lower = text.toLowerCase();
  const high = ["crucial", "essentiel", "fondamental", "clé", "important", "majeur", "critique", "vital", "central"];
  const medium = ["utile", "notable", "significatif", "intéressant", "pertinent"];
  const low = ["mineur", "détail", "anecdote", "secondaire", "marginal"];

  for (const w of high) if (lower.includes(w)) return 5;
  for (const w of medium) if (lower.includes(w)) return 4;
  for (const w of low) if (lower.includes(w)) return 2;
  return 3;
}

function extractTitle(text: string): string {
  // If there's a line break, use the first line as title
  const lines = text.split("\n").filter((l) => l.trim());
  if (lines.length > 1 && lines[0].length <= 80) {
    return lines[0].trim();
  }
  // Use first sentence
  const sentenceEnd = text.search(/[.!?]\s/);
  if (sentenceEnd > 0 && sentenceEnd <= 80) {
    return text.slice(0, sentenceEnd + 1).trim();
  }
  // Truncate
  if (text.length <= 60) return text;
  const spaceIdx = text.lastIndexOf(" ", 55);
  return text.slice(0, spaceIdx > 20 ? spaceIdx : 55) + "...";
}

function extractContent(text: string, title: string): string {
  // If the title was the first line, use the rest
  if (text.startsWith(title)) {
    const rest = text.slice(title.length).trim();
    return rest || title;
  }
  return text;
}

function autoGenerateTags(text: string, existingTags: string[]): string[] {
  const lower = text.toLowerCase();
  const autoTags: string[] = [];

  // Detect common acronyms & terms
  const acronyms = [
    "SOR", "DMA", "CCP", "CSD", "DVP", "CSA", "MTF", "OTF", "VWAP", "TWAP",
    "MiFID", "MiFIR", "ESMA", "AMF", "EMIR", "CSDR", "DORA", "SFTR",
    "LCH", "Eurex", "Euroclear", "Clearstream", "Euronext", "CBOE",
    "RTS", "FIX", "API",
  ];
  for (const a of acronyms) {
    if (lower.includes(a.toLowerCase()) && !existingTags.some((t) => t.toLowerCase() === a.toLowerCase())) {
      autoTags.push(a);
    }
  }
  return autoTags;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const WELCOME_MSG: ChatMessage = {
  id: "welcome",
  type: "info",
  text: "Décrivez ce que vous avez appris aujourd'hui. Le cerveau créera automatiquement un noeud de savoir.\n\nAstuces :\n• #tag pour ajouter des tags\n• @domaine pour cibler un domaine\n• Le domaine est auto-détecté sinon",
  timestamp: new Date(),
};

export default function ChatPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MSG]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { addNode, domains, links } = useKnowledgeStore();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const handleSend = useCallback(() => {
    const raw = input.trim();
    if (!raw) return;

    const msgId = Date.now().toString(36);

    // Add user message
    const userMsg: ChatMessage = {
      id: msgId + "-u",
      type: "user",
      text: raw,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Parse
    const { domain: explicitDomain, cleaned: afterDomain } = extractExplicitDomain(raw);
    const { tags: hashTags, cleaned: afterTags } = extractHashtags(afterDomain);
    const detectedDomain = detectDomain(afterTags, explicitDomain);
    const importance = detectImportance(afterTags);
    const title = extractTitle(afterTags);
    const content = extractContent(afterTags, title);
    const autoTags = autoGenerateTags(afterTags, hashTags);
    const allTags = [...hashTags, ...autoTags];

    // Get domain info
    const domainInfo = domains.find((d) => d.id === detectedDomain);
    const domainName = domainInfo?.name || detectedDomain;
    const domainColor = domainInfo?.color || "#4fc3f7";

    // Count links before
    const linksBefore = useKnowledgeStore.getState().links.length;

    // Create node
    addNode({
      title,
      content,
      domainId: detectedDomain,
      tags: allTags,
      importance,
    });

    // Count new connections
    const linksAfter = useKnowledgeStore.getState().links.length;
    const newConnections = linksAfter - linksBefore;

    // System response
    const sysMsg: ChatMessage = {
      id: msgId + "-s",
      type: "system",
      text: newConnections > 0
        ? `Noeud créé et connecté à ${newConnections} noeud${newConnections > 1 ? "s" : ""} existant${newConnections > 1 ? "s" : ""}.`
        : "Noeud créé. Ajoutez des tags communs pour créer des connexions.",
      timestamp: new Date(),
      nodeCreated: {
        title,
        domainName,
        domainColor,
        tags: allTags,
        connections: newConnections,
        importance,
      },
    };
    setMessages((prev) => [...prev, sysMsg]);
  }, [input, addNode, domains]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ---- Collapsed button ----
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 bg-neural-panel/90 border border-neural-border
                   rounded-full w-14 h-14 flex items-center justify-center
                   hover:border-neural-accent/50 hover:shadow-neural transition-all group"
        title="Ouvrir le chat"
      >
        <svg
          className="w-6 h-6 text-neural-accent group-hover:scale-110 transition-transform"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </button>
    );
  }

  // ---- Open panel ----
  return (
    <div className="fixed bottom-0 left-0 top-0 w-[380px] z-40 flex flex-col
                    bg-neural-panel/95 backdrop-blur-md border-r border-neural-border shadow-neural">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neural-border">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <h2 className="text-sm font-semibold text-white">Chat &rarr; Cerveau</h2>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-neural-muted hover:text-white transition-colors p-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id}>
            {msg.type === "info" && (
              <div className="bg-neural-bg/80 border border-neural-border rounded-lg p-3 text-xs text-neural-muted leading-relaxed whitespace-pre-line">
                {msg.text}
              </div>
            )}

            {msg.type === "user" && (
              <div className="flex justify-end">
                <div className="max-w-[85%] bg-neural-accent/15 border border-neural-accent/20
                                rounded-lg rounded-br-sm px-3 py-2 text-sm text-neural-text">
                  {msg.text}
                </div>
              </div>
            )}

            {msg.type === "system" && (
              <div className="flex justify-start">
                <div className="max-w-[90%] space-y-2">
                  {/* Node card */}
                  {msg.nodeCreated && (
                    <div
                      className="rounded-lg border px-3 py-2.5 space-y-1.5"
                      style={{
                        borderColor: msg.nodeCreated.domainColor + "30",
                        backgroundColor: msg.nodeCreated.domainColor + "08",
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: msg.nodeCreated.domainColor }}
                        />
                        <span className="text-sm font-medium text-white truncate">
                          {msg.nodeCreated.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-neural-muted">
                        <span style={{ color: msg.nodeCreated.domainColor }}>
                          {msg.nodeCreated.domainName}
                        </span>
                        <span>&middot;</span>
                        <span>{"★".repeat(msg.nodeCreated.importance)}</span>
                      </div>
                      {msg.nodeCreated.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {msg.nodeCreated.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-1.5 py-0.5 text-[10px] rounded bg-neural-border text-neural-muted"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  {/* Status text */}
                  <p className="text-xs text-neural-muted px-1">
                    {msg.nodeCreated && msg.nodeCreated.connections > 0 && (
                      <span className="text-green-400">
                        ↗ {msg.nodeCreated.connections} connexion{msg.nodeCreated.connections > 1 ? "s" : ""} auto
                        &nbsp;&middot;&nbsp;
                      </span>
                    )}
                    {msg.text}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-neural-border">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ce que j'ai appris aujourd'hui..."
            rows={2}
            className="flex-1 bg-neural-bg border border-neural-border rounded-lg px-3 py-2
                       text-sm text-white placeholder-neural-muted resize-none
                       focus:outline-none focus:border-neural-accent/50 transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="self-end bg-neural-accent/20 text-neural-accent border border-neural-accent/30
                       rounded-lg px-3 py-2 hover:bg-neural-accent/30 transition-colors
                       disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-neural-muted mt-1.5 px-1">
          Entrée pour envoyer &middot; Shift+Entrée pour retour à la ligne
        </p>
      </div>
    </div>
  );
}
