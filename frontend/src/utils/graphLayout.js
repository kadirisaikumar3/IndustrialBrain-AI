import dagre from "dagre";

const dagreGraph = new dagre.graphlib.Graph();

dagreGraph.setDefaultEdgeLabel(() => ({}));

const NODE_WIDTH = 220;
const NODE_HEIGHT = 70;

export function buildMindMap(nodes, edges) {

  // Reset graph configuration
  dagreGraph.setGraph({
    rankdir: "TB",
    ranksep: 70,
    nodesep: 40,
    marginx: 20,
    marginy: 20,
  });

  // IMPORTANT: Clear previous graph
  dagreGraph.nodes().forEach((id) => {
    dagreGraph.removeNode(id);
  });

  // Add Nodes
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    });
  });

  // Add Edges
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Calculate layout
  dagre.layout(dagreGraph);

  // -----------------------------
  // Debug Graph Bounds
  // -----------------------------
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  console.log("===== DAGRE POSITIONS =====");

  nodes.forEach((node) => {
    const pos = dagreGraph.node(node.id);

    console.log(node.id, pos);

    minX = Math.min(minX, pos.x);
    maxX = Math.max(maxX, pos.x);

    minY = Math.min(minY, pos.y);
    maxY = Math.max(maxY, pos.y);
  });

  console.log("===== GRAPH BOUNDS =====");
console.log("minX =", minX);
console.log("maxX =", maxX);
console.log("minY =", minY);
console.log("maxY =", maxY);
console.log("width =", maxX - minX);
console.log("height =", maxY - minY);

  // Apply positions
  const layoutedNodes = nodes.map((node) => {
    const position = dagreGraph.node(node.id);

    return {
      ...node,
      position: {
        x: position.x - NODE_WIDTH / 2,
        y: position.y - NODE_HEIGHT / 2,
      },
    };
  });

  return {
    nodes: layoutedNodes,
    edges,
  };
}