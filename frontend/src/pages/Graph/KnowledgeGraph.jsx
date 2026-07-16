import { useEffect, useState, useRef } from "react";
import { toPng } from "html-to-image";
import { toast } from "react-toastify";
import download from "downloadjs";
import API from "../../services/api";

import sampleGraph from "../../data/sampleGraph";

import { buildMindMap } from "../../utils/graphLayout";

import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  MarkerType,
  Handle,
  Position,
  getNodesBounds,
  getViewportForBounds,
} from "reactflow";

import "reactflow/dist/style.css";

import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";


/* =========================================================
   Custom Node
========================================================= */

const CustomNode = ({ data }) => {

  const borderClass = data.selected
    ? "border-cyan-400 shadow-[0_0_35px_#22d3ee] scale-110"
    : data.parent
      ? "border-emerald-400 shadow-[0_0_20px_#22c55e]"
      : data.child
        ? "border-orange-400 shadow-[0_0_20px_#fb923c]"
        : data.highlighted
          ? "border-purple-400 shadow-[0_0_20px_#a855f7]"
          : "border-slate-600";

 return (
  <div
    style={{
      width: 220,
      minHeight: 90,
      background: "#2563eb",
      color: "white",
      border: "2px solid white",
      borderRadius: 16,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontWeight: "bold",
      position: "relative",
    }}
  >
    <Handle
      type="target"
      position={Position.Top}
    />

    {data.label}

    <Handle
      type="source"
      position={Position.Bottom}
    />
  </div>
);
};

const nodeTypes = {
  custom: CustomNode,
};

/* =========================================================
   ReactFlow Configuration
========================================================= */



const fitViewOptions = {
  padding: 0.30,
};

const defaultEdgeOptions = {

  type: "smoothstep",

  animated: true,

  style: {
    stroke: "#38bdf8",
    strokeWidth: 2.5,
  },

  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: "#38bdf8",
  },
};
/* =========================================================
   Knowledge Graph Component
========================================================= */

function KnowledgeGraph() {

  /* -----------------------------
     States
  ------------------------------ */

  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState("");

  const [searchText, setSearchText] = useState("");

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const [loading, setLoading] = useState(false);

  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const [nodeExplanation, setNodeExplanation] = useState("");

  const [parentConnections, setParentConnections] = useState({});
  const [childConnections, setChildConnections] = useState({});

  const [loadingExplanation, setLoadingExplanation] =
    useState(false);

  const [explanationCache, setExplanationCache] =
    useState({});

  const [nodeCount, setNodeCount] = useState(0);

  const [edgeCount, setEdgeCount] = useState(0);

  const [selectedDocumentName, setSelectedDocumentName] = useState("");

  const graphRef = useRef(null);
  const reactFlowInstance = useRef(null);




  /* -----------------------------
     Load Documents
  ------------------------------ */

  useEffect(() => {

    loadDocuments();

  }, []);

  /* -----------------------------
     Search Highlight
  ------------------------------ */

  useEffect(() => {

    setNodes(prev => {

      const updated = prev.map(node => ({

        ...node,

        data: {

          ...node.data,

          highlighted:

            searchText.trim() !== "" &&

            node.data.label
              .toLowerCase()
              .includes(searchText.toLowerCase()),

        },

      }));

      if (
        searchText.trim() !== "" &&
        reactFlowInstance.current
      ) {

        const foundNode = updated.find(node =>
          node.data.label
            .toLowerCase()
            .includes(searchText.toLowerCase())
        );

        if (foundNode) {

          reactFlowInstance.current.setCenter(
            foundNode.position.x,
            foundNode.position.y,
            {
              zoom: 1.4,
              duration: 700,
            }
          );

        }

      }

      return updated;

    });

  }, [searchText]);
  /* -----------------------------
     Export PNG
  ------------------------------ */

  const exportGraph = async () => {

    if (!reactFlowInstance.current || !graphRef.current) return;

    try {

      const nodesBounds = getNodesBounds(nodes);

      const viewport = getViewportForBounds(
        nodesBounds,
        nodesBounds.width + 400,
        nodesBounds.height + 400,
        0.5,
        2
      );

      // Save current transform
      const reactFlowViewport =
        graphRef.current.querySelector(".react-flow__viewport");

      if (!reactFlowViewport) return;

      const previousTransform =
        reactFlowViewport.style.transform;

      const previousWidth = graphRef.current.style.width;
      const previousHeight = graphRef.current.style.height;
      const previousOverflow = graphRef.current.style.overflow;

      reactFlowViewport.style.transform = `
translate(${viewport.x}px, ${viewport.y}px)
scale(${viewport.zoom})
`;

      graphRef.current.style.width = `${nodesBounds.width + 400}px`;
      graphRef.current.style.height = `${nodesBounds.height + 400}px`;
      graphRef.current.style.overflow = "visible";
      await new Promise((resolve) => setTimeout(resolve, 100));

      const dataUrl = await toPng(graphRef.current, {

        backgroundColor: "#020617",

        cacheBust: true,

        pixelRatio: 4,

        width: nodesBounds.width + 400,

        height: nodesBounds.height + 400,

        style: {

          width: `${nodesBounds.width + 400}px`,

          height: `${nodesBounds.height + 400}px`,

        },

      });

      // Restore original transform
      reactFlowViewport.style.transform = previousTransform;
      graphRef.current.style.width = previousWidth;
      graphRef.current.style.height = previousHeight;
      graphRef.current.style.overflow = previousOverflow;

      download(dataUrl, "knowledge-graph.png");

      toast.success("Knowledge Graph exported successfully!");

    } catch (err) {

      console.error(err);

      toast.error("Unable to export graph.");

    }

  };

  const resetView = () => {

    if (!reactFlowInstance.current) return;

    reactFlowInstance.current.fitView({

      padding: 0.25,

      duration: 800,

    });

  };
  /* -----------------------------
     Dagre Layout
  ------------------------------ */

  /* -----------------------------
     Load Documents
  ------------------------------ */

  const loadDocuments = async () => {

    try {

      const response = await API.get("/dashboard/documents");

      setDocuments(response.data);

    }

    catch (error) {

      console.error(error);

    }

  };
  /* =========================================================
   Generate Knowledge Graph
========================================================= */

  const loadGraph = async () => {

    if (!selectedDocument) {

      toast.warning("Please select a document.");

      return;

    }

    try {

      setLoading(true);

      

      // =====================================
      // TEMPORARY SAMPLE GRAPH
      // =====================================

      const response = await API.get(
    `/dashboard/knowledge-graph/${selectedDocument}`
);

const graph = response.data;



      if (!graph.nodes || !graph.edges) {

        toast.error(graph.error || "Invalid graph received.");

        return;

      }

      /* -----------------------------
         Node Colors
      ------------------------------ */

      // -----------------------------
      // Build Parent & Child Maps
      // -----------------------------

      const parentMap = {};
      const childMap = {};

      graph.edges.forEach((edge) => {

        parentMap[edge.target] = edge.source;

        if (!childMap[edge.source]) {
          childMap[edge.source] = [];
        }

        childMap[edge.source].push(edge.target);

      });

      setParentConnections(parentMap);
      setChildConnections(childMap);

      // -----------------------------
      // Dynamic Node Color
      // -----------------------------

      const getNodeColor = (nodeId) => {

        if (!parentMap[nodeId]) {

          return "linear-gradient(135deg,#2563eb,#3b82f6)";
        }

        if (childMap[nodeId]) {

          return "linear-gradient(135deg,#059669,#10b981)";
        }

        return "linear-gradient(135deg,#ea580c,#fb923c)";
      };

      /* -----------------------------
   Convert to ReactFlow Nodes
------------------------------ */

const nodeIdMap = {};

console.log("===== GRAPH JSON =====");
console.log(graph);

const incoming = {};

graph.edges.forEach(edge => {
  incoming[edge.target] = (incoming[edge.target] || 0) + 1;
});

const roots = graph.nodes.filter(node => !incoming[node.id]);

console.log("ROOT COUNT =", roots.length);
console.log("ROOTS =", roots);

const flowNodes = graph.nodes.map((node, index) => {

  const uniqueId = `${node.id}-${index}`;

  nodeIdMap[node.id] = uniqueId;

  return {

    id: uniqueId,

    type: "custom",

    position: {
      x: 0,
      y: 0,
    },

    data: {

      label: node.label,

      color: getNodeColor(node.label),

      selected: false,

      highlighted:
        searchText.trim() !== "" &&
        node.label
          .toLowerCase()
          .includes(searchText.toLowerCase()),

    },

  };

});


      /* -----------------------------
         Convert to ReactFlow Edges
      ------------------------------ */

     const addedEdges = new Set();

const flowEdges = [];

graph.edges.forEach((edge, index) => {

  const source = nodeIdMap[edge.source];
  const target = nodeIdMap[edge.target];

  // Skip invalid nodes
  if (!source || !target) return;

  // Skip self loops
  if (source === target) return;

  const forward = `${source}-${target}`;
  const reverse = `${target}-${source}`;

  // Skip reverse edge to avoid cycles
  if (addedEdges.has(reverse)) return;

  addedEdges.add(forward);

  flowEdges.push({
    id: `edge-${index}`,
    source,
    target,
  });

});


      /* -----------------------------
         Apply Dagre Layout
      ------------------------------ */
      
      console.log("========== FLOW NODES ==========");
console.log(flowNodes);

console.log("========== FLOW EDGES ==========");
console.log(flowEdges);

console.log("========== GRAPH JSON ==========");
console.log(graph);

const layoutedGraph = buildMindMap(
  flowNodes,
  flowEdges
);

console.log("FIRST NODE");
console.log(layoutedGraph.nodes[0]);



      setNodes(layoutedGraph.nodes);
      setEdges(layoutedGraph.edges);

      console.log(layoutedGraph.nodes);

      setTimeout(() => {

        if (reactFlowInstance.current) {

          reactFlowInstance.current.fitView({

    padding: 0.15,

    duration: 800,

});

        }

      }, 200);


      setNodeCount(layoutedGraph.nodes.length);
      setEdgeCount(layoutedGraph.edges.length);



      const selectedDoc = documents.find(
        (doc) => doc.id == selectedDocument
      );

      if (selectedDoc) {
        setSelectedDocumentName(selectedDoc.fileName);
      }
    }
    catch (error) {

      console.error(error);

      toast.error("Unable to generate Knowledge Graph.");

    }

    finally {

      setLoading(false);

    }

  };
  /* =========================================================
     AI Explanation
  ========================================================= */

  const explainNode = async (event, node) => {

    try {

      setSelectedNode(node);

      setSelectedNodeId(node.id);

      // ======================================
      // Auto Center Selected Node
      // ======================================

      if (reactFlowInstance.current) {

        reactFlowInstance.current.setCenter(

          node.position.x,

          node.position.y,

          {

            zoom: 1.25,

            duration: 800,

          }

        );

      }

      // Highlight selected node
      // ========================================
      // Highlight Selected + Parent + Children
      // ========================================

      const parent = parentConnections[node.id];

      const children = childConnections[node.id] || [];

      setNodes((prev) =>
        prev.map((n) => {

          const isSelected = n.id === node.id;

          const isParent = n.id === parent;

          const isChild = children.includes(n.id);

          return {

            ...n,

            data: {

              ...n.data,

              selected: isSelected,

              parent: isParent,

              child: isChild,

              faded: !isSelected && !isParent && !isChild,

            },

          };

        })
      );

      // Check cache first
      if (explanationCache[node.data.label]) {

        setNodeExplanation(

          explanationCache[node.data.label]

        );

        return;

      }

      setLoadingExplanation(true);

      setNodeExplanation("");

      const response = await API.post(
  "/dashboard/explain",
  {
    topic: node.data.label,
  }
);

      setNodeExplanation(

        response.data.explanation

      );

      // Save in cache

      setExplanationCache((prev) => ({

        ...prev,

        [node.data.label]:
          response.data.explanation,

      }));

    }

    catch (error) {

      console.error(error);

      setNodeExplanation(

        "Unable to generate explanation."

      );

    }

    finally {

      setLoadingExplanation(false);

    }

  };
  /* =========================================================
     UI
  ========================================================= */

  return (

    <div className="flex min-h-screen bg-slate-900">

      <Sidebar />

      <div className="flex-1">

        <Topbar />

        <main className="p-8">

          <div className="mx-auto max-w-7xl">

            {/* Header */}

            <div className="rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 p-8 shadow-2xl">

              <h1 className="text-5xl font-extrabold text-white">

                🧠 AI Knowledge Graph

              </h1>

              <p className="mt-4 text-lg text-purple-100">

                Click any node to get an AI explanation powered by Gemini.

              </p>

            </div>

            {/* Search */}

            <div className="mt-8 rounded-3xl border border-slate-700 bg-slate-800 p-6 shadow-xl">

              <h2 className="text-2xl font-bold text-white">

                🔍 Search Node

              </h2>

              <input

                type="text"

                placeholder="Search node..."

                value={searchText}

                onChange={(e) => setSearchText(e.target.value)}

                className="mt-4 w-full rounded-xl border border-slate-600 bg-slate-700 p-4 text-white outline-none"

              />

            </div>

            {/* Document Selector */}

            <div className="mt-8 rounded-3xl border border-slate-700 bg-slate-800 p-8">

              <h2 className="text-3xl font-bold text-white">

                📄 Select Document

              </h2>

              <select

                value={selectedDocument}

                onChange={(e) =>

                  setSelectedDocument(e.target.value)

                }

                className="mt-6 w-full rounded-xl border border-slate-600 bg-slate-700 p-4 text-white"

              >

                <option value="">

                  Select a document...

                </option>

                {documents.map((doc) => (

                  <option

                    key={doc.id}

                    value={doc.id}

                  >

                    {doc.fileName}

                  </option>

                ))}

              </select>

              <div className="mt-8">

                <button

                  onClick={loadGraph}

                  disabled={loading}

                  className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 font-bold text-white transition hover:scale-105"

                >

                  {

                    loading

                      ? "Generating..."

                      : "🚀 Generate Knowledge Graph"

                  }

                </button>

              </div>

            </div>

            {/* Graph + AI Panel */}
            {/* Statistics */}

            <div className="mt-8 grid grid-cols-4 gap-6">
              {/* Knowledge Graph Legend */}

              <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-800 p-5">

                <h3 className="mb-4 text-xl font-bold text-white">
                  🌈 Knowledge Graph Legend
                </h3>

                <div className="flex flex-wrap gap-8">

                  <div className="flex items-center gap-3">

                    <div className="h-5 w-5 rounded-full bg-blue-600"></div>

                    <span className="text-slate-300">
                      Root Concept
                    </span>

                  </div>

                  <div className="flex items-center gap-3">

                    <div className="h-5 w-5 rounded-full bg-green-600"></div>

                    <span className="text-slate-300">
                      Intermediate Concept
                    </span>

                  </div>

                  <div className="flex items-center gap-3">

                    <div className="h-5 w-5 rounded-full bg-orange-500"></div>

                    <span className="text-slate-300">
                      Leaf Concept
                    </span>

                  </div>

                </div>

              </div>

              <div className="rounded-2xl bg-slate-800 p-6 border border-slate-700">

                <p className="text-slate-400 text-sm">
                  Document
                </p>

                <h3 className="mt-2 text-xl font-bold text-cyan-400 truncate">
                  {selectedDocumentName || "None"}
                </h3>

              </div>

              <div className="rounded-2xl bg-slate-800 p-6 border border-slate-700">

                <p className="text-slate-400 text-sm">
                  Nodes
                </p>

                <h3 className="mt-2 text-4xl font-bold text-green-400">
                  {nodeCount}
                </h3>

              </div>

              <div className="rounded-2xl bg-slate-800 p-6 border border-slate-700">

                <p className="text-slate-400 text-sm">
                  Connections
                </p>

                <h3 className="mt-2 text-4xl font-bold text-orange-400">
                  {edgeCount}
                </h3>

              </div>

              <div className="rounded-2xl bg-slate-800 p-6 border border-slate-700">

                <p className="text-slate-400 text-sm">
                  AI Status
                </p>

                <h3 className="mt-2 text-xl font-bold text-purple-400">
                  Ready
                </h3>

              </div>

            </div>

            <div className="mt-8 grid grid-cols-12 gap-6">
              {/* ===============================
                Knowledge Graph
            ================================ */}

              <div className="col-span-8 rounded-3xl border border-slate-700 bg-slate-800 p-6">

                <div className="mb-6 flex items-center justify-between">

                  <h2 className="text-3xl font-bold text-white">
                    🌐 Knowledge Graph
                  </h2>

                  <div className="flex gap-3">

                    <button
                      onClick={() => {

                        if (reactFlowInstance.current) {

                          reactFlowInstance.current.fitView({

                            padding: 0.35,
                            duration: 700,

                          });

                        }

                      }}
                      className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                      🔄 Reset View
                    </button>

                    <button
                      onClick={exportGraph}
                      className="rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700"
                    >
                      📤 Export PNG
                    </button>

                  </div>

                </div>

                <div
                  ref={graphRef}
                  className="relative h-[1100px] rounded-2xl border border-slate-700 bg-slate-950"
                >

                  {loading && (
                    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-2xl bg-slate-900/80 backdrop-blur-sm">

                      <div className="mb-4 h-14 w-14 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>

                      <h2 className="text-2xl font-bold text-white">
                        🧠 Building Knowledge Graph...
                      </h2>

                      <p className="mt-2 text-slate-300">
                        Please wait while AI prepares the graph.
                      </p>

                    </div>
                  )}


                  {!loading && nodes.length === 0 ? (

  <div className="flex h-full flex-col items-center justify-center text-center">

    <div className="text-8xl">
      🧠
    </div>

    <h2 className="mt-8 text-4xl font-bold text-white">
      No Knowledge Graph Yet
    </h2>

    <p className="mt-4 max-w-xl text-lg text-slate-400">
      Select a document and click
      <span className="font-semibold text-cyan-400">
        {" "}Generate Knowledge Graph
      </span>
      to visualize concepts and relationships.
    </p>

  </div>

) : (

                  <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    fitView
                    fitViewOptions={fitViewOptions}
                    defaultEdgeOptions={defaultEdgeOptions}
                    onNodeClick={explainNode}

                    onInit={(instance) => {
                      reactFlowInstance.current = instance;
                    }}

                    panOnDrag={true}
                    panOnScroll={true}
                    zoomOnScroll={true}
                    selectionOnDrag={false}

                    style={{
                      cursor: "grab",
                    }}
                  >

                    <MiniMap
                      pannable
                      zoomable
                      nodeStrokeWidth={3}
                      nodeBorderRadius={8}

                      position="bottom-right"

                      style={{
                        background: "#0f172a",
                        border: "1px solid #334155",
                        borderRadius: "12px",
                      }}

                      maskColor="rgba(15,23,42,0.6)"
                    />

                    <Controls
                      position="top-right"
                      showInteractive={false}
                    />

                    <Background
                      gap={22}
                      size={1.2}
                      color="#1e293b"
                    />

                  </ReactFlow>
)}
                </div>

              </div>
              {/* ===============================
                AI Explanation Panel
            ================================ */}

              <div className="col-span-4 rounded-3xl border border-slate-700 bg-slate-800 p-6">

                <h2 className="text-3xl font-bold text-white">
                  🤖 AI Explanation
                </h2>

                {!selectedNode ? (

                  <div className="mt-12 text-center">

                    <div className="text-6xl">
                      🧠
                    </div>

                    <p className="mt-6 text-slate-400">
                      Click any node to generate an AI explanation.
                    </p>

                  </div>

                ) : loadingExplanation ? (

                  <div className="mt-12 text-center">

                    <div
                      className="
                      mx-auto
                      h-12
                      w-12
                      animate-spin
                      rounded-full
                      border-4
                      border-cyan-500
                      border-t-transparent
                    "
                    />

                    <p className="mt-6 text-cyan-400">
                      Gemini is thinking...
                    </p>

                  </div>

                ) : (

                  <>

                    <h3 className="mt-6 text-2xl font-bold text-cyan-400">

                      {selectedNode.data.label}

                    </h3>

                    <div
                      className="
                      mt-6
                      max-h-[520px]
                      overflow-y-auto
                      rounded-xl
                      bg-slate-900
                      p-5
                    "
                    >

                      <pre
                        className="
                        whitespace-pre-wrap
                        font-sans
                        text-sm
                        leading-7
                        text-slate-200
                      "
                      >

                        {nodeExplanation}

                      </pre>

                    </div>

                  </>

                )}

              </div>

            </div>

          </div>

        </main>

      </div>

    </div>

  );

}

export default KnowledgeGraph;
