export interface Domain {
  id: string;
  name: string;
  color: string;
  description: string;
}

export interface KnowledgeNode {
  id: string;
  title: string;
  content: string;
  domainId: string;
  tags: string[];
  importance: number; // 1-5, affects node size
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeLink {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface GraphNode {
  id: string;
  name: string;
  val: number;
  color: string;
  domainId: string;
  description: string;
}

export interface GraphLink {
  source: string;
  target: string;
}
