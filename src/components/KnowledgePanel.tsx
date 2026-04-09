"use client";

import { useState } from "react";
import { useKnowledgeStore } from "@/store/useKnowledgeStore";
import NodeModal from "./NodeModal";

export default function KnowledgePanel() {
  const {
    domains,
    nodes,
    links,
    selectedDomainId,
    selectedNodeId,
    panelOpen,
    searchQuery,
    selectDomain,
    selectNode,
    setSearchQuery,
    deleteNode,
    togglePanel,
  } = useKnowledgeStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);

  const filteredNodes = useKnowledgeStore((s) => s.getFilteredNodes());
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const selectedDomain = domains.find((d) => d.id === selectedDomainId);

  const getNodeConnectionCount = (nodeId: string) =>
    links.filter((l) => l.source === nodeId || l.target === nodeId).length;

  const getDomainNodeCount = (domainId: string) =>
    nodes.filter((n) => n.domainId === domainId).length;

  if (!panelOpen) {
    return (
      <button
        onClick={togglePanel}
        className="fixed top-4 right-4 z-50 bg-neural-panel border border-neural-border
                   rounded-lg px-3 py-2 text-neural-accent hover:bg-neural-border transition-colors"
        title="Ouvrir le panneau"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    );
  }

  return (
    <>
      <div className="fixed top-0 right-0 h-full w-[420px] z-40 flex flex-col
                      bg-neural-panel/95 backdrop-blur-md border-l border-neural-border shadow-neural">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neural-border">
          <div>
            <h1 className="text-lg font-semibold text-white tracking-wide">
              Market Brain
            </h1>
            <p className="text-xs text-neural-muted mt-0.5">
              {nodes.length} noeuds &middot; {links.length} connexions
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-neural-accent/20 text-neural-accent border border-neural-accent/30
                         rounded-md px-3 py-1.5 text-sm font-medium hover:bg-neural-accent/30
                         transition-colors"
            >
              + Ajouter
            </button>
            <button
              onClick={togglePanel}
              className="text-neural-muted hover:text-white transition-colors p-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-neural-border">
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neural-bg border border-neural-border rounded-md px-3 py-2
                       text-sm text-neural-text placeholder-neural-muted
                       focus:outline-none focus:border-neural-accent/50 transition-colors"
          />
        </div>

        {/* Domain Tabs */}
        <div className="px-4 py-3 border-b border-neural-border">
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => selectDomain(null)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                !selectedDomainId
                  ? "bg-neural-accent/20 text-neural-accent border border-neural-accent/30"
                  : "text-neural-muted hover:text-neural-text border border-transparent"
              }`}
            >
              Tous ({nodes.length})
            </button>
            {domains.map((domain) => (
              <button
                key={domain.id}
                onClick={() =>
                  selectDomain(selectedDomainId === domain.id ? null : domain.id)
                }
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  selectedDomainId === domain.id
                    ? "border"
                    : "text-neural-muted hover:text-neural-text border border-transparent"
                }`}
                style={
                  selectedDomainId === domain.id
                    ? {
                        backgroundColor: domain.color + "20",
                        color: domain.color,
                        borderColor: domain.color + "40",
                      }
                    : undefined
                }
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: domain.color }}
                />
                {domain.name} ({getDomainNodeCount(domain.id)})
              </button>
            ))}
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto">
          {/* Selected node detail */}
          {selectedNode ? (
            <div className="p-4 border-b border-neural-border">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: domains.find(
                        (d) => d.id === selectedNode.domainId
                      )?.color,
                    }}
                  />
                  <h3 className="text-white font-medium">{selectedNode.title}</h3>
                </div>
                <button
                  onClick={() => selectNode(null)}
                  className="text-neural-muted hover:text-white text-xs"
                >
                  &times;
                </button>
              </div>
              <p className="text-sm text-neural-text leading-relaxed mb-3">
                {selectedNode.content}
              </p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {selectedNode.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-xs rounded-full bg-neural-border text-neural-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-neural-muted">
                <span>
                  Importance: {"★".repeat(selectedNode.importance)}
                  {"☆".repeat(5 - selectedNode.importance)}
                </span>
                <span>{getNodeConnectionCount(selectedNode.id)} connexions</span>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setEditingNodeId(selectedNode.id)}
                  className="text-xs px-3 py-1.5 rounded bg-neural-border text-neural-text
                             hover:bg-neural-accent/20 hover:text-neural-accent transition-colors"
                >
                  Modifier
                </button>
                <button
                  onClick={() => {
                    if (confirm("Supprimer ce noeud ?")) {
                      deleteNode(selectedNode.id);
                    }
                  }}
                  className="text-xs px-3 py-1.5 rounded bg-neural-border text-red-400
                             hover:bg-red-500/20 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ) : selectedDomain ? (
            <div className="p-4 border-b border-neural-border">
              <h3
                className="font-medium mb-1"
                style={{ color: selectedDomain.color }}
              >
                {selectedDomain.name}
              </h3>
              <p className="text-xs text-neural-muted">{selectedDomain.description}</p>
            </div>
          ) : null}

          {/* Node list */}
          <div className="p-2">
            {filteredNodes.map((node) => {
              const domain = domains.find((d) => d.id === node.domainId);
              const isActive = node.id === selectedNodeId;
              return (
                <button
                  key={node.id}
                  onClick={() => selectNode(node.id)}
                  className={`w-full text-left p-3 rounded-lg mb-1 transition-all ${
                    isActive
                      ? "bg-neural-accent/10 border border-neural-accent/20"
                      : "hover:bg-neural-border/50 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: domain?.color }}
                    />
                    <span className="text-sm text-white font-medium truncate">
                      {node.title}
                    </span>
                    <span className="text-xs text-neural-muted ml-auto flex-shrink-0">
                      {getNodeConnectionCount(node.id)}
                    </span>
                  </div>
                  <p className="text-xs text-neural-muted line-clamp-2 pl-4">
                    {node.content}
                  </p>
                </button>
              );
            })}
            {filteredNodes.length === 0 && (
              <div className="text-center py-8 text-neural-muted text-sm">
                Aucun noeud trouvé
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-neural-border flex items-center justify-between text-xs text-neural-muted">
          <span>Mis à jour: {new Date().toLocaleDateString("fr-FR")}</span>
          <button
            onClick={() => {
              const data = {
                domains: useKnowledgeStore.getState().domains,
                nodes: useKnowledgeStore.getState().nodes,
                links: useKnowledgeStore.getState().links,
              };
              const blob = new Blob([JSON.stringify(data, null, 2)], {
                type: "application/json",
              });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `market-brain-${new Date().toISOString().split("T")[0]}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="hover:text-neural-accent transition-colors"
          >
            Exporter JSON
          </button>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {(showAddModal || editingNodeId) && (
        <NodeModal
          editNodeId={editingNodeId}
          onClose={() => {
            setShowAddModal(false);
            setEditingNodeId(null);
          }}
        />
      )}
    </>
  );
}
