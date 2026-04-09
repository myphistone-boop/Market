"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Domain, KnowledgeNode, KnowledgeLink } from "@/types";
import { defaultDomains, seedNodes, seedLinks } from "@/data/initialData";

interface KnowledgeState {
  domains: Domain[];
  nodes: KnowledgeNode[];
  links: KnowledgeLink[];
  selectedDomainId: string | null;
  selectedNodeId: string | null;
  panelOpen: boolean;
  searchQuery: string;

  // Actions
  selectDomain: (id: string | null) => void;
  selectNode: (id: string | null) => void;
  togglePanel: () => void;
  setSearchQuery: (query: string) => void;

  // CRUD Nodes
  addNode: (node: Omit<KnowledgeNode, "id" | "createdAt" | "updatedAt">) => void;
  updateNode: (id: string, updates: Partial<KnowledgeNode>) => void;
  deleteNode: (id: string) => void;

  // CRUD Links
  addLink: (source: string, target: string, label?: string) => void;
  removeLink: (id: string) => void;

  // CRUD Domains
  addDomain: (domain: Omit<Domain, "id">) => void;

  // Utils
  getFilteredNodes: () => KnowledgeNode[];
  resetToSeed: () => void;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

export const useKnowledgeStore = create<KnowledgeState>()(
  persist(
    (set, get) => ({
      domains: defaultDomains,
      nodes: seedNodes,
      links: seedLinks,
      selectedDomainId: null,
      selectedNodeId: null,
      panelOpen: true,
      searchQuery: "",

      selectDomain: (id) => set({ selectedDomainId: id, selectedNodeId: null }),
      selectNode: (id) => set({ selectedNodeId: id, panelOpen: true }),
      togglePanel: () => set((s) => ({ panelOpen: !s.panelOpen })),
      setSearchQuery: (query) => set({ searchQuery: query }),

      addNode: (nodeData) => {
        const node: KnowledgeNode = {
          ...nodeData,
          id: generateId(),
          createdAt: todayISO(),
          updatedAt: todayISO(),
        };
        set((s) => ({ nodes: [...s.nodes, node] }));
        // Auto-link: connect to nodes in same domain that share tags
        const state = get();
        const sameDomainnodes = state.nodes.filter(
          (n) => n.domainId === node.domainId && n.id !== node.id
        );
        const newLinks: KnowledgeLink[] = [];
        for (const existing of sameDomainnodes) {
          const sharedTags = node.tags.filter((t) =>
            existing.tags.some(
              (et) => et.toLowerCase() === t.toLowerCase()
            )
          );
          if (sharedTags.length > 0) {
            newLinks.push({
              id: generateId(),
              source: node.id,
              target: existing.id,
            });
          }
        }
        // Also link to nodes in other domains with shared tags
        const otherNodes = state.nodes.filter(
          (n) => n.domainId !== node.domainId && n.id !== node.id
        );
        for (const existing of otherNodes) {
          const sharedTags = node.tags.filter((t) =>
            existing.tags.some(
              (et) => et.toLowerCase() === t.toLowerCase()
            )
          );
          if (sharedTags.length >= 1) {
            newLinks.push({
              id: generateId(),
              source: node.id,
              target: existing.id,
            });
          }
        }
        if (newLinks.length > 0) {
          set((s) => ({ links: [...s.links, ...newLinks] }));
        }
      },

      updateNode: (id, updates) =>
        set((s) => ({
          nodes: s.nodes.map((n) =>
            n.id === id ? { ...n, ...updates, updatedAt: todayISO() } : n
          ),
        })),

      deleteNode: (id) =>
        set((s) => ({
          nodes: s.nodes.filter((n) => n.id !== id),
          links: s.links.filter((l) => l.source !== id && l.target !== id),
          selectedNodeId: s.selectedNodeId === id ? null : s.selectedNodeId,
        })),

      addLink: (source, target, label) =>
        set((s) => ({
          links: [
            ...s.links,
            { id: generateId(), source, target, label },
          ],
        })),

      removeLink: (id) =>
        set((s) => ({ links: s.links.filter((l) => l.id !== id) })),

      addDomain: (domainData) => {
        const domain: Domain = { ...domainData, id: generateId() };
        set((s) => ({ domains: [...s.domains, domain] }));
      },

      getFilteredNodes: () => {
        const { nodes, selectedDomainId, searchQuery } = get();
        let filtered = nodes;
        if (selectedDomainId) {
          filtered = filtered.filter((n) => n.domainId === selectedDomainId);
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          filtered = filtered.filter(
            (n) =>
              n.title.toLowerCase().includes(q) ||
              n.content.toLowerCase().includes(q) ||
              n.tags.some((t) => t.toLowerCase().includes(q))
          );
        }
        return filtered;
      },

      resetToSeed: () =>
        set({
          domains: defaultDomains,
          nodes: seedNodes,
          links: seedLinks,
          selectedDomainId: null,
          selectedNodeId: null,
        }),
    }),
    {
      name: "market-brain-storage",
    }
  )
);
