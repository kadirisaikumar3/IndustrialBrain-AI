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

import AppLayout from "../../components/layout/AppLayout";



const CustomNode = ({ data }) => {

  const borderClass = data.selected
    ? "border-cyan-400 shadow-[0_0_35px_#22d3ee] scale-110"
    : data.parent
      ? "border-emerald-400 shadow-[0_0_20px_#22c55e]"
      : data.child
        ? "border-orange-400 shadow-[0_0_20px_#fb923c]"
        : data.highlighted
          ? "border-purple-400 shadow-[0_0_20px_#a855f7]"
          : "border-theme";

  return (

    <div
  className={`
    relative
    flex
    min-h-[90px]
    w-[220px]
    items-center
    justify-center
    rounded-2xl
    border-2
    font-bold
    text-center
    transition-all
    duration-300
    hover:scale-105
    hover:shadow-[0_0_30px_rgba(34,211,238,0.45)]
    ${borderClass}
    ${data.faded ? "opacity-30 blur-[1px]" : "opacity-100"}
  `}
      style={{
        background: data.color || "linear-gradient(135deg,#2563eb,#3b82f6)",
        color: "white",
      }}
    >

      <Handle
        type="target"
        position={Position.Top}
      />

      <span className="px-3">
        <>
  {data.selected && (
    <div className="absolute -inset-2 animate-pulse rounded-2xl border-2 border-cyan-300 opacity-40" />
  )}

  <span className="relative px-3">
    {data.label}
  </span>
</>
      </span>

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



function KnowledgeGraph() {

  /* -----------------------------
     States
  ------------------------------ */

  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState("");

  const [searchText, setSearchText] = useState("");

  const [searchSuggestions, setSearchSuggestions] = useState([]);

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

  const [rootNodeCount, setRootNodeCount] = useState(0);

const [leafNodeCount, setLeafNodeCount] = useState(0);

const [graphStatus, setGraphStatus] = useState("Healthy");

  const [selectedDocumentName, setSelectedDocumentName] =
    useState("");

  const graphRef = useRef(null);

  const reactFlowInstance = useRef(null);
  const graphContainerRef = useRef(null);


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

    setNodes((prev) => {

      const suggestions =
  searchText.trim() === ""
    ? []
    : prev
        .filter((node) =>
          node.data.label
            .toLowerCase()
            .includes(searchText.toLowerCase())
        )
        .slice(0, 5);

setSearchSuggestions(
  suggestions.map((node) => node.data.label)
);

      const updated = prev.map((node) => ({

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

        const foundNode = updated.find((node) =>

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

      graphRef.current.style.width =
        `${nodesBounds.width + 400}px`;

      graphRef.current.style.height =
        `${nodesBounds.height + 400}px`;

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

  const exportGraphJson = () => {

  try {

    const graphData = {

      generatedAt: new Date().toISOString(),

      statistics: {

        nodes: nodeCount,

        edges: edgeCount,

        rootNodes: rootNodeCount,

        leafNodes: leafNodeCount,

      },

      nodes,

      edges,

    };

    const blob = new Blob(

      [JSON.stringify(graphData, null, 2)],

      { type: "application/json" }

    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "knowledge-graph.json";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    toast.success("Knowledge Graph JSON exported!");

  } catch (err) {

    console.error(err);

    toast.error("Unable to export JSON.");

  }

};



  const resetView = () => {

    if (!reactFlowInstance.current) return;

    reactFlowInstance.current.fitView({

      padding: 0.25,

      duration: 800,

    });

  };

  const zoomIn = () => {

  if (!reactFlowInstance.current) return;

  reactFlowInstance.current.zoomIn({
    duration: 300,
  });

};

const zoomOut = () => {

  if (!reactFlowInstance.current) return;

  reactFlowInstance.current.zoomOut({
    duration: 300,
  });

};

const fitGraph = () => {

  if (!reactFlowInstance.current) return;

  reactFlowInstance.current.fitView({
    padding: 0.20,
    duration: 700,
  });

};

const toggleFullscreen = async () => {

  if (!graphContainerRef.current) return;

  try {

    if (!document.fullscreenElement) {

      await graphContainerRef.current.requestFullscreen();

      toast.success("Entered Fullscreen");

    } else {

      await document.exitFullscreen();

      toast.success("Exited Fullscreen");

    }

  } catch (err) {

    console.error(err);

    toast.error("Fullscreen not supported.");

  }

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

 

  const loadGraph = async () => {

    if (!selectedDocument) {

      toast.warning("Please select a document.");

      return;

    }

    try {

      setLoading(true);



      const response = await API.get(
        `/dashboard/knowledge-graph/${selectedDocument}`
      );

      const graph = response.data;

      if (!graph.nodes || !graph.edges) {

        toast.error(graph.error || "Invalid graph received.");

        return;

      }

      /* -----------------------------
         Build Parent & Child Maps
      ------------------------------ */

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

      /* -----------------------------
         Dynamic Node Colors
      ------------------------------ */

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
 

      const incoming = {};

      graph.edges.forEach((edge) => {

        incoming[edge.target] =
          (incoming[edge.target] || 0) + 1;

      });

      const roots = graph.nodes.filter(
        (node) => !incoming[node.id]
      );


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

        // Skip self loop

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
         Apply Mind Map Layout
      ------------------------------ */

      const layoutedGraph = buildMindMap(

        flowNodes,

        flowEdges

      );
      setNodes(layoutedGraph.nodes);

      setEdges(layoutedGraph.edges);


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

      // Root Nodes (no incoming edges)
const rootNodes = graph.nodes.filter(
  (node) => !parentMap[node.id]
);

// Leaf Nodes (no outgoing edges)
const leafNodes = graph.nodes.filter(
  (node) => !childMap[node.id]
);

setRootNodeCount(rootNodes.length);

setLeafNodeCount(leafNodes.length);

setGraphStatus(
  layoutedGraph.nodes.length > 0
    ? "Healthy"
    : "Empty"
);

      const selectedDoc = documents.find(

        (doc) => doc.id == selectedDocument

      );

      if (selectedDoc) {

        setSelectedDocumentName(selectedDoc.fileName);

      }

    } catch (error) {

      console.error(error);

      toast.error("Unable to generate Knowledge Graph.");

    } finally {

      setLoading(false);

    }

  };



  const explainNode = async (event, node) => {
        try {

      setSelectedNode(node);

      setSelectedNodeId(node.id);



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
            // Save explanation in cache

      setExplanationCache((prev) => ({

        ...prev,

        [node.data.label]: response.data.explanation,

      }));

    } catch (error) {

      console.error(error);

      setNodeExplanation(

        "Unable to generate explanation."

      );

    } finally {

      setLoadingExplanation(false);

    }

  };



  return (

    <AppLayout>

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

        <div className="mt-8 rounded-3xl card-bg p-6 shadow-xl">

          <h2 className="text-2xl font-bold text-primary">

            🔍 Search Node

          </h2>

          <input

            type="text"

            placeholder="Search node..."

            value={searchText}

            onChange={(e) => setSearchText(e.target.value)}

            className="mt-4 w-full rounded-xl border border-theme search-box p-4 text-primary placeholder:text-secondary outline-none transition-all focus:border-cyan-400"

          />

            {searchSuggestions.length > 0 && (

  <div className="mt-2 rounded-xl border border-theme overflow-hidden">

    {searchSuggestions.map((item) => (

      <button
        key={item}
        onClick={() => setSearchText(item)}
        className="block w-full border-b border-theme px-4 py-3 text-left transition hover:bg-cyan-500 hover:text-white last:border-b-0"
      >
        📌 {item}
      </button>

    ))}

  </div>

)}

        </div>

        {/* Empty State */}

        {documents.length === 0 ? (

          <div className="mt-8 rounded-3xl card-bg p-10 text-center">

            <h2 className="text-2xl font-bold text-primary">

              No Documents Available

            </h2>

            <p className="mt-3 text-secondary">

              Upload a document first to generate a Knowledge Graph.

            </p>

          </div>

        ) : (

          <>
                      {/* Controls */}

            <div className="mt-8 grid gap-6 lg:grid-cols-4">

              {/* Document Selector */}

              <div className="rounded-3xl card-bg p-6 shadow-xl lg:col-span-2">

                <label className="mb-3 block text-lg font-bold text-primary">

                  📄 Select Document

                </label>

                <select

                  value={selectedDocument}

                  onChange={(e) =>

                    setSelectedDocument(e.target.value)

                  }

                  className="w-full rounded-xl border border-theme search-box p-4 text-primary outline-none transition focus:border-cyan-400"

                >

                  <option value="">

                    Choose a document

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

                <button

                  onClick={loadGraph}

                  disabled={loading}

                  className="mt-6 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4 font-bold text-white transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"

                >

                  {loading

                    ? "Generating Knowledge Graph..."

                    : "🚀 Generate Knowledge Graph"}

                </button>

              </div>

              {/* Statistics */}

              <div className="rounded-3xl card-bg p-6 shadow-xl">

                <h3 className="mb-5 text-xl font-bold text-primary">
  📊 Graph Analytics
</h3>

<div className="space-y-4">

  <div className="rounded-xl bg-blue-500/10 p-4">
    <p className="text-sm text-secondary">
      Total Nodes
    </p>
    <p className="text-3xl font-bold text-blue-500">
      {nodeCount}
    </p>
  </div>

  <div className="rounded-xl bg-green-500/10 p-4">
    <p className="text-sm text-secondary">
      Total Edges
    </p>
    <p className="text-3xl font-bold text-green-500">
      {edgeCount}
    </p>
  </div>

  <div className="rounded-xl bg-yellow-500/10 p-4">
    <p className="text-sm text-secondary">
      Root Nodes
    </p>
    <p className="text-3xl font-bold text-yellow-500">
      {rootNodeCount}
    </p>
  </div>

  <div className="rounded-xl bg-purple-500/10 p-4">
    <p className="text-sm text-secondary">
      Leaf Nodes
    </p>
    <p className="text-3xl font-bold text-purple-500">
      {leafNodeCount}
    </p>
  </div>

  <div className="rounded-xl bg-orange-500/10 p-4">
    <p className="text-sm text-secondary">
      Selected Node
    </p>
    <p className="truncate text-lg font-bold text-orange-500">
      {selectedNode?.data?.label || "-"}
    </p>
  </div>

  <div className="rounded-xl bg-emerald-500/10 p-4">
    <p className="text-sm text-secondary">
      Graph Status
    </p>
    <p className="text-lg font-bold text-emerald-500">
      {graphStatus === "Healthy"
        ? "✅ Healthy"
        : "⚠️ Empty"}
    </p>
  </div>

</div>

              </div>

              {/* Legend */}

              <div className="rounded-3xl card-bg p-6 shadow-xl">

                <h3 className="mb-5 text-xl font-bold text-primary">

                  🌈 Legend

                </h3>

                <div className="space-y-4">

                  <div className="flex items-center gap-3">

                    <div className="h-4 w-4 rounded-full bg-blue-500" />

                    <span className="text-secondary">

                      Root Node

                    </span>

                  </div>

                  <div className="flex items-center gap-3">

                    <div className="h-4 w-4 rounded-full bg-green-500" />

                    <span className="text-secondary">

                      Parent Node

                    </span>

                  </div>

                  <div className="flex items-center gap-3">

                    <div className="h-4 w-4 rounded-full bg-orange-500" />

                    <span className="text-secondary">

                      Leaf Node

                    </span>

                  </div>

                </div>

              </div>

            </div>
                        {/* Graph */}

            <div className="mt-8 rounded-3xl card-bg p-6 shadow-xl">

              <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div>

                  <h2 className="text-2xl font-bold text-primary">

                    🌐 Knowledge Graph

                  </h2>

                  {selectedDocumentName && (

                    <p className="mt-1 text-secondary">

                      {selectedDocumentName}

                    </p>

                  )}

                </div>

                <div className="flex flex-wrap gap-3">

                  <button

                    onClick={resetView}

                    className="rounded-xl border border-theme px-5 py-3 font-semibold text-primary transition hover:bg-cyan-500 hover:text-white"

                  >

                    Reset View

                  </button>

                  <button

                    onClick={exportGraph}

                    className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-5 py-3 font-semibold text-white transition hover:scale-[1.02]"

                  >

                    Export PNG

                  </button>

                  <button
    onClick={exportGraphJson}
    className="rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 px-5 py-3 font-semibold text-white transition hover:scale-[1.02]"
>
    Export JSON
</button>

                </div>

              </div>

              <div
    ref={graphContainerRef}
    className="relative"
>
    <div
        ref={graphRef}

                className="h-[700px] overflow-hidden rounded-2xl border border-theme"

              >

                {loading ? (

    <div className="flex h-full flex-col items-center justify-center">

        <div className="mb-8 h-16 w-16 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>

        <h2 className="text-3xl font-bold text-cyan-400">
            🧠 Building Knowledge Graph...
        </h2>

        <div className="mt-10 w-[320px]">

            <div className="h-3 overflow-hidden rounded-full bg-slate-700">

                <div className="h-full w-full animate-pulse rounded-full bg-cyan-400"></div>

            </div>

        </div>

        <div className="mt-10 space-y-3 text-center">

            <p className="text-secondary">
                📄 Reading document...
            </p>

            <p className="text-secondary">
                🧩 Extracting concepts...
            </p>

            <p className="text-secondary">
                🔗 Building relationships...
            </p>

            <p className="text-secondary">
                🤖 Optimizing layout...
            </p>

            <p className="text-secondary">
                ✨ Rendering graph...
            </p>

        </div>

    </div>

) : (

    <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={explainNode}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={fitViewOptions}
        defaultEdgeOptions={defaultEdgeOptions}
        minZoom={0.2}
        maxZoom={2}
        attributionPosition="bottom-left"
        onInit={(instance) => {
            reactFlowInstance.current = instance;
        }}
    >
        <Background gap={18} size={1.2} />
        <Controls />
        <MiniMap pannable zoomable />
    </ReactFlow>

)}

                {/* Floating Toolbar */}

<div className="absolute right-6 top-6 z-50 flex flex-col gap-3">

  <button
    onClick={zoomIn}
    className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900/90 text-xl text-white shadow-xl transition-all duration-200 hover:scale-110 hover:bg-cyan-500"
    title="Zoom In"
  >
    ➕
  </button>

  <button
    onClick={zoomOut}
    className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900/90 text-xl text-white shadow-xl transition-all duration-200 hover:scale-110 hover:bg-cyan-500"
    title="Zoom Out"
  >
    ➖
  </button>

  <button
    onClick={fitGraph}
    className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900/90 text-xl text-white shadow-xl transition-all duration-200 hover:scale-110 hover:bg-emerald-500"
    title="Fit Graph"
  >
    🎯
  </button>

  <button
    onClick={toggleFullscreen}
    className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900/90 text-xl text-white shadow-xl transition-all duration-200 hover:scale-110 hover:bg-indigo-500"
    title="Fullscreen"
  >
    🖥
  </button>

  <button
    onClick={exportGraph}
    className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900/90 text-xl text-white shadow-xl transition-all duration-200 hover:scale-110 hover:bg-green-500"
    title="Export PNG"
  >
    📸
  </button>

</div>

              </div>

            </div>
            </div>
                        {/* AI Explanation */}

            <div className="mt-8 rounded-3xl card-bg p-6 shadow-xl">

              <h2 className="mb-6 text-2xl font-bold text-primary">

                🤖 AI Explanation

              </h2>

              {!selectedNode ? (

                <div className="rounded-2xl border border-dashed border-theme p-10 text-center">

                  <p className="text-secondary">

                    Click a node in the Knowledge Graph to view its AI-generated explanation.

                  </p>

                </div>

              ) : (

                <>

                  <div className="mb-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 p-5">

                    <h3 className="flex items-center gap-3 text-xl font-bold text-white">

                      🧠 {selectedNode.data.label}

                    </h3>

                  </div>

                  {loadingExplanation ? (

                    <div className="flex items-center justify-center py-16">

                      <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />

                    </div>

                  ) : (

                    <div className="rounded-2xl border border-theme p-6">

                      <pre className="whitespace-pre-wrap leading-8 text-primary font-sans">
  {nodeExplanation}
</pre>
                    </div>

                  )}

                </>

              )}

            </div>

          </>

        )}

      </div>

    </AppLayout>

  );

}

export default KnowledgeGraph;