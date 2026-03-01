import { getAllContent } from './markdown';

export interface GraphNode {
  id: string;
  label: string;
  category: string;
  subcategory: string;
  slug: string;
  url: string;
  tags: string[];
}

export interface GraphLink {
  source: string;
  target: string;
  type: 'tag' | 'reference';
}

export interface ContentGraph {
  nodes: GraphNode[];
  links: GraphLink[];
}

// Build a graph of all content and their connections
export async function buildContentGraph(): Promise<ContentGraph> {
  const allContent = await getAllContent();
  const nodes: GraphNode[] = [];
  const linksSet = new Set<string>();
  const nodeMap = new Map<string, GraphNode>();

  // Create nodes
  allContent.forEach((file) => {
    const id = `${file.category}/${file.subcategory}/${file.slug}`;
    const node: GraphNode = {
      id,
      label: file.frontmatter.title,
      category: file.category,
      subcategory: file.subcategory,
      slug: file.slug,
      url: `/${file.category}/${file.subcategory}/${file.slug}`,
      tags: file.frontmatter.tags || [],
    };
    nodes.push(node);
    nodeMap.set(id, node);
  });

  // Create links based on shared tags
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const node1 = nodes[i];
      const node2 = nodes[j];
      const sharedTags = node1.tags.filter((tag) => node2.tags.includes(tag));

      if (sharedTags.length > 0) {
        linksSet.add(`${node1.id}:${node2.id}`);
      }
    }
  }

  // Convert links set to array
  const links: GraphLink[] = Array.from(linksSet).map((linkStr) => {
    const [source, target] = linkStr.split(':');
    return { source, target, type: 'tag' };
  });

  return { nodes, links };
}

// Get subgraph for a specific node and its connections
export async function getConnectionSubgraph(
  targetId: string,
  depth = 1
): Promise<ContentGraph> {
  const graph = await buildContentGraph();
  const visited = new Set<string>();
  const queue = [targetId];
  const connectedNodes = new Set<string>();

  // BFS to find connected nodes
  let currentDepth = 0;
  while (queue.length > 0 && currentDepth < depth) {
    const length = queue.length;
    currentDepth++;

    for (let i = 0; i < length; i++) {
      const nodeId = queue.shift()!;
      if (visited.has(nodeId)) continue;

      visited.add(nodeId);
      connectedNodes.add(nodeId);

      // Find all connected nodes
      graph.links.forEach((link) => {
        if (link.source === nodeId && !visited.has(link.target)) {
          queue.push(link.target);
        } else if (link.target === nodeId && !visited.has(link.source)) {
          queue.push(link.source);
        }
      });
    }
  }

  // Filter nodes and links for subgraph
  const subgraphNodes = graph.nodes.filter((node) =>
    connectedNodes.has(node.id)
  );
  const subgraphLinks = graph.links.filter(
    (link) =>
      connectedNodes.has(link.source) && connectedNodes.has(link.target)
  );

  return { nodes: subgraphNodes, links: subgraphLinks };
}

// Get statistics about the graph
export async function getGraphStats(): Promise<{
  totalNodes: number;
  totalLinks: number;
  averageConnections: number;
  mostConnectedNode: GraphNode | null;
  commonestTag: string | null;
}> {
  const graph = await buildContentGraph();

  const nodeConnectionCounts = new Map<string, number>();
  const tagCounts = new Map<string, number>();

  // Count connections per node
  graph.links.forEach((link) => {
    nodeConnectionCounts.set(
      link.source,
      (nodeConnectionCounts.get(link.source) || 0) + 1
    );
    nodeConnectionCounts.set(
      link.target,
      (nodeConnectionCounts.get(link.target) || 0) + 1
    );
  });

  // Count tag frequencies
  graph.nodes.forEach((node) => {
    node.tags.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });

  // Find most connected node
  let mostConnected: [string, number] | null = null;
  let maxConnections = 0;
  nodeConnectionCounts.forEach((count, nodeId) => {
    if (count > maxConnections) {
      maxConnections = count;
      mostConnected = [nodeId, count];
    }
  });

  const mostConnectedNode = mostConnected
    ? graph.nodes.find((n) => n.id === mostConnected![0]) || null
    : null;

  // Find most common tag
  let mostCommonTag: [string, number] | null = null;
  let maxTagCount = 0;
  tagCounts.forEach((count, tag) => {
    if (count > maxTagCount) {
      maxTagCount = count;
      mostCommonTag = [tag, count];
    }
  });

  const totalConnections = Array.from(nodeConnectionCounts.values()).reduce(
    (a, b) => a + b,
    0
  );
  const averageConnections =
    graph.nodes.length > 0 ? totalConnections / graph.nodes.length : 0;

  return {
    totalNodes: graph.nodes.length,
    totalLinks: graph.links.length,
    averageConnections: parseFloat(averageConnections.toFixed(2)),
    mostConnectedNode,
    commonestTag: mostCommonTag ? mostCommonTag[0] : null,
  };
}
