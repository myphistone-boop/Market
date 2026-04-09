import { Domain, KnowledgeNode, KnowledgeLink } from "@/types";

export const defaultDomains: Domain[] = [
  {
    id: "execution",
    name: "Execution",
    color: "#4fc3f7",
    description: "Order routing, execution venues, algorithmes, smart order routing",
  },
  {
    id: "clearing",
    name: "Clearing & Settlement",
    color: "#81c784",
    description: "CCP, chambres de compensation, T+2, CSDs, post-trade",
  },
  {
    id: "revenue",
    name: "Revenus",
    color: "#ffb74d",
    description: "Commissions, spread, frais de recherche, modèle économique",
  },
  {
    id: "costs",
    name: "Coûts",
    color: "#e57373",
    description: "Frais de bourse, clearing, réglementaires, technologie",
  },
  {
    id: "regulation",
    name: "Régulation",
    color: "#ba68c8",
    description: "MiFID II, best execution, reporting, compliance",
  },
  {
    id: "research",
    name: "Research",
    color: "#4dd0e1",
    description: "Couverture analyste, distribution, unbundling",
  },
  {
    id: "clients",
    name: "Clients & Flow",
    color: "#fff176",
    description: "Types de clients, lifecycle des ordres, relation commerciale",
  },
];

export const seedNodes: KnowledgeNode[] = [
  // Execution
  {
    id: "exec-1",
    title: "Smart Order Routing (SOR)",
    content:
      "Système automatisé qui route les ordres vers la meilleure venue d'exécution selon le prix, la liquidité et les coûts. Obligation MiFID II de best execution.",
    domainId: "execution",
    tags: ["SOR", "best-execution", "venues", "MiFID"],
    importance: 5,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "exec-2",
    title: "Venues d'exécution",
    content:
      "Marchés réglementés (Euronext), MTF (CBOE, Turquoise), OTF, Systematic Internalisers. Fragmentation de la liquidité post-MiFID II.",
    domainId: "execution",
    tags: ["venues", "MTF", "Euronext", "fragmentation"],
    importance: 4,
    createdAt: "2024-01-16",
    updatedAt: "2024-01-16",
  },
  {
    id: "exec-3",
    title: "Algorithmes d'exécution",
    content:
      "VWAP, TWAP, Implementation Shortfall, Participation. Minimiser l'impact marché pour les gros ordres institutionnels.",
    domainId: "execution",
    tags: ["algos", "VWAP", "TWAP", "impact-marché"],
    importance: 4,
    createdAt: "2024-01-17",
    updatedAt: "2024-01-17",
  },
  {
    id: "exec-4",
    title: "DMA - Direct Market Access",
    content:
      "Accès direct au marché pour les clients. Le broker fournit la connectivité et les contrôles pré-trade mais le client gère sa propre exécution.",
    domainId: "execution",
    tags: ["DMA", "accès-direct", "clients"],
    importance: 3,
    createdAt: "2024-01-18",
    updatedAt: "2024-01-18",
  },

  // Clearing & Settlement
  {
    id: "clear-1",
    title: "CCP - Contrepartie Centrale",
    content:
      "LCH, Eurex Clearing. S'interpose entre acheteur et vendeur pour éliminer le risque de contrepartie. Exige des marges initiales et de variation.",
    domainId: "clearing",
    tags: ["CCP", "LCH", "risque", "marges"],
    importance: 5,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "clear-2",
    title: "Cycle de settlement T+1",
    content:
      "Passage de T+2 à T+1 en Europe prévu. Livraison des titres contre paiement (DVP). Impact sur la gestion de trésorerie et le financement.",
    domainId: "clearing",
    tags: ["settlement", "T+1", "DVP", "trésorerie"],
    importance: 4,
    createdAt: "2024-01-16",
    updatedAt: "2024-01-16",
  },
  {
    id: "clear-3",
    title: "CSDs - Dépositaires centraux",
    content:
      "Euroclear, Clearstream. Tiennent les registres de propriété des titres. CSDR impose des pénalités de settlement fails.",
    domainId: "clearing",
    tags: ["CSD", "Euroclear", "CSDR", "fails"],
    importance: 3,
    createdAt: "2024-01-17",
    updatedAt: "2024-01-17",
  },

  // Revenue
  {
    id: "rev-1",
    title: "Commissions de courtage",
    content:
      "Revenue principal du broker. Modèle high-touch (sales trading) vs low-touch (electronic/DMA). Compression continue des marges.",
    domainId: "revenue",
    tags: ["commissions", "courtage", "marges", "high-touch"],
    importance: 5,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "rev-2",
    title: "Research unbundling - MiFID II",
    content:
      "Séparation obligatoire entre exécution et recherche. Les clients doivent payer la recherche séparément. Impact majeur sur le modèle économique.",
    domainId: "revenue",
    tags: ["research", "unbundling", "MiFID", "modèle"],
    importance: 4,
    createdAt: "2024-01-16",
    updatedAt: "2024-01-16",
  },
  {
    id: "rev-3",
    title: "CSA - Commission Sharing Agreements",
    content:
      "Mécanisme permettant au client d'allouer une partie des commissions d'exécution pour payer la recherche de tiers.",
    domainId: "revenue",
    tags: ["CSA", "commissions", "research", "allocation"],
    importance: 3,
    createdAt: "2024-01-17",
    updatedAt: "2024-01-17",
  },

  // Costs
  {
    id: "cost-1",
    title: "Frais de bourse",
    content:
      "Frais facturés par les venues pour chaque transaction. Structure maker/taker : rebate pour apporteur de liquidité, frais pour preneur.",
    domainId: "costs",
    tags: ["frais", "bourse", "maker-taker", "venues"],
    importance: 4,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "cost-2",
    title: "Frais de clearing",
    content:
      "Coûts de la compensation via CCP. Frais par trade + contribution au fonds de défaut. Netting réduit les coûts.",
    domainId: "costs",
    tags: ["clearing", "CCP", "netting", "fonds-défaut"],
    importance: 4,
    createdAt: "2024-01-16",
    updatedAt: "2024-01-16",
  },
  {
    id: "cost-3",
    title: "Coûts technologiques",
    content:
      "Infrastructure de trading, co-location, connectivité, données de marché. Investissement continu nécessaire pour rester compétitif.",
    domainId: "costs",
    tags: ["technologie", "infrastructure", "co-location", "données"],
    importance: 3,
    createdAt: "2024-01-17",
    updatedAt: "2024-01-17",
  },

  // Regulation
  {
    id: "reg-1",
    title: "MiFID II / MiFIR",
    content:
      "Cadre réglementaire européen. Transparence pré/post-trade, best execution, research unbundling, reporting des transactions.",
    domainId: "regulation",
    tags: ["MiFID", "transparence", "best-execution", "reporting"],
    importance: 5,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "reg-2",
    title: "Transaction Reporting",
    content:
      "Obligation de reporter toutes les transactions à l'autorité compétente (AMF via ESMA). Données détaillées sur chaque trade.",
    domainId: "regulation",
    tags: ["reporting", "AMF", "ESMA", "compliance"],
    importance: 4,
    createdAt: "2024-01-16",
    updatedAt: "2024-01-16",
  },
  {
    id: "reg-3",
    title: "Best Execution Policy",
    content:
      "Obligation de prendre toutes les mesures suffisantes pour obtenir le meilleur résultat possible pour le client. Facteurs : prix, coût, rapidité, probabilité.",
    domainId: "regulation",
    tags: ["best-execution", "MiFID", "politique", "clients"],
    importance: 4,
    createdAt: "2024-01-17",
    updatedAt: "2024-01-17",
  },

  // Research
  {
    id: "res-1",
    title: "Couverture analyste",
    content:
      "Analyse fondamentale des sociétés cotées. Notes (Buy/Hold/Sell), objectifs de cours, modèles financiers. Valeur ajoutée clé du broker.",
    domainId: "research",
    tags: ["analyste", "couverture", "fondamental", "notes"],
    importance: 4,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "res-2",
    title: "Distribution de la recherche",
    content:
      "Distribution aux clients institutionnels. Morning meetings, notes flash, roadshows. Monetisation post-MiFID II via abonnements ou CSA.",
    domainId: "research",
    tags: ["distribution", "institutionnels", "morning-meeting", "CSA"],
    importance: 3,
    createdAt: "2024-01-16",
    updatedAt: "2024-01-16",
  },

  // Clients
  {
    id: "cli-1",
    title: "Buy-side vs Sell-side",
    content:
      "Buy-side : asset managers, hedge funds, assureurs (achètent la recherche et l'exécution). Sell-side : brokers comme Kepler (vendent ces services).",
    domainId: "clients",
    tags: ["buy-side", "sell-side", "asset-managers", "hedge-funds"],
    importance: 5,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "cli-2",
    title: "Lifecycle d'un ordre",
    content:
      "Réception → Validation pré-trade → Routing/Exécution → Allocation → Confirmation → Clearing → Settlement. Chaque étape implique des contrôles.",
    domainId: "clients",
    tags: ["ordre", "lifecycle", "workflow", "contrôles"],
    importance: 5,
    createdAt: "2024-01-16",
    updatedAt: "2024-01-16",
  },
  {
    id: "cli-3",
    title: "Sales Trading",
    content:
      "Interface humaine entre le broker et le client. Conseil sur l'exécution, idées de trading, accès à la recherche. Relation commerciale clé.",
    domainId: "clients",
    tags: ["sales", "trading", "relation", "high-touch"],
    importance: 4,
    createdAt: "2024-01-17",
    updatedAt: "2024-01-17",
  },
];

export const seedLinks: KnowledgeLink[] = [
  // Execution internal links
  { id: "l1", source: "exec-1", target: "exec-2" },
  { id: "l2", source: "exec-1", target: "exec-3" },
  { id: "l3", source: "exec-3", target: "exec-4" },

  // Clearing internal links
  { id: "l4", source: "clear-1", target: "clear-2" },
  { id: "l5", source: "clear-2", target: "clear-3" },

  // Cross-domain: Execution ↔ Regulation
  { id: "l6", source: "exec-1", target: "reg-1" },
  { id: "l7", source: "exec-1", target: "reg-3" },

  // Cross-domain: Revenue ↔ Research
  { id: "l8", source: "rev-2", target: "res-1" },
  { id: "l9", source: "rev-3", target: "res-2" },

  // Cross-domain: Costs ↔ Execution
  { id: "l10", source: "cost-1", target: "exec-2" },

  // Cross-domain: Costs ↔ Clearing
  { id: "l11", source: "cost-2", target: "clear-1" },

  // Cross-domain: Clients ↔ Execution
  { id: "l12", source: "cli-2", target: "exec-1" },
  { id: "l13", source: "cli-3", target: "rev-1" },
  { id: "l14", source: "cli-1", target: "res-1" },

  // Cross-domain: Regulation ↔ Revenue
  { id: "l15", source: "reg-1", target: "rev-2" },

  // Cross-domain: Clearing ↔ Lifecycle
  { id: "l16", source: "clear-1", target: "cli-2" },
  { id: "l17", source: "clear-2", target: "cli-2" },

  // DMA ↔ Clients
  { id: "l18", source: "exec-4", target: "cli-1" },

  // Costs ↔ Revenue model
  { id: "l19", source: "cost-3", target: "rev-1" },

  // Reporting ↔ Settlement
  { id: "l20", source: "reg-2", target: "clear-2" },
];
