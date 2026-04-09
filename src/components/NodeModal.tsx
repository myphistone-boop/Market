"use client";

import { useState, useEffect } from "react";
import { useKnowledgeStore } from "@/store/useKnowledgeStore";

interface NodeModalProps {
  editNodeId?: string | null;
  onClose: () => void;
}

export default function NodeModal({ editNodeId, onClose }: NodeModalProps) {
  const { domains, nodes, addNode, updateNode } = useKnowledgeStore();
  const existingNode = editNodeId ? nodes.find((n) => n.id === editNodeId) : null;

  const [title, setTitle] = useState(existingNode?.title || "");
  const [content, setContent] = useState(existingNode?.content || "");
  const [domainId, setDomainId] = useState(existingNode?.domainId || domains[0]?.id || "");
  const [tagsInput, setTagsInput] = useState(existingNode?.tags.join(", ") || "");
  const [importance, setImportance] = useState(existingNode?.importance || 3);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (existingNode) {
      updateNode(existingNode.id, { title, content, domainId, tags, importance });
    } else {
      addNode({ title, content, domainId, tags, importance });
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-neural-panel border border-neural-border rounded-xl shadow-neural-strong
                   w-full max-w-lg mx-4 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-neural-border flex items-center justify-between">
          <h2 className="text-white font-semibold">
            {existingNode ? "Modifier le noeud" : "Nouveau noeud de savoir"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-neural-muted hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs text-neural-muted mb-1.5 uppercase tracking-wider">
              Titre
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Smart Order Routing"
              required
              className="w-full bg-neural-bg border border-neural-border rounded-md px-3 py-2.5
                         text-sm text-white placeholder-neural-muted
                         focus:outline-none focus:border-neural-accent/50 transition-colors"
            />
          </div>

          {/* Domain */}
          <div>
            <label className="block text-xs text-neural-muted mb-1.5 uppercase tracking-wider">
              Domaine
            </label>
            <select
              value={domainId}
              onChange={(e) => setDomainId(e.target.value)}
              className="w-full bg-neural-bg border border-neural-border rounded-md px-3 py-2.5
                         text-sm text-white focus:outline-none focus:border-neural-accent/50
                         transition-colors"
            >
              {domains.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs text-neural-muted mb-1.5 uppercase tracking-wider">
              Contenu
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Décrivez ce concept, ce que vous avez appris..."
              required
              rows={4}
              className="w-full bg-neural-bg border border-neural-border rounded-md px-3 py-2.5
                         text-sm text-white placeholder-neural-muted resize-none
                         focus:outline-none focus:border-neural-accent/50 transition-colors"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs text-neural-muted mb-1.5 uppercase tracking-wider">
              Tags (séparés par des virgules)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Ex: SOR, best-execution, MiFID"
              className="w-full bg-neural-bg border border-neural-border rounded-md px-3 py-2.5
                         text-sm text-white placeholder-neural-muted
                         focus:outline-none focus:border-neural-accent/50 transition-colors"
            />
            <p className="text-xs text-neural-muted mt-1">
              Les tags communs créent automatiquement des connexions entre noeuds
            </p>
          </div>

          {/* Importance */}
          <div>
            <label className="block text-xs text-neural-muted mb-1.5 uppercase tracking-wider">
              Importance ({importance}/5)
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setImportance(level)}
                  className={`w-10 h-10 rounded-md border transition-all text-lg ${
                    level <= importance
                      ? "bg-neural-accent/20 border-neural-accent/40 text-neural-accent"
                      : "bg-neural-bg border-neural-border text-neural-muted"
                  }`}
                >
                  {level <= importance ? "★" : "☆"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-neural-border flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-neural-muted hover:text-white
                       border border-neural-border rounded-md transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium bg-neural-accent/20 text-neural-accent
                       border border-neural-accent/30 rounded-md hover:bg-neural-accent/30
                       transition-colors"
          >
            {existingNode ? "Enregistrer" : "Ajouter au cerveau"}
          </button>
        </div>
      </form>
    </div>
  );
}
