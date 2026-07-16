import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Settings from "./pages/Settings/Settings";

import Home from "./pages/Home/Home";
import Dashboard from "./pages/Dashboard/Dashboard";
import Upload from "./pages/Upload/Upload";
import AIChat from "./pages/AI/AIChat";
import KnowledgeGraph from "./pages/Graph/KnowledgeGraph";
import PDFViewer from "./pages/PDF/PDFViewer";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";

import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>

        <Route
  path="/upload"
  element={
    <ProtectedRoute>
      <Upload />
    </ProtectedRoute>
  }
/>
        <Route
  path="/ai"
  element={
    <ProtectedRoute>
      <AIChat />
    </ProtectedRoute>
  }
/>
        <Route
  path="/graph"
  element={
    <ProtectedRoute>
      <KnowledgeGraph />
    </ProtectedRoute>
  }
/>

        <Route
  path="/settings"
  element={
    <ProtectedRoute>
      <Settings />
    </ProtectedRoute>
  }
/>
        <Route
          path="/pdf/:id"
          element={<PDFViewer />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/login"
          element={<Login />}
        />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />

    </>
  );
}

export default App;