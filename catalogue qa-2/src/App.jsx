import { Routes, Route, Navigate } from "react-router-dom";

import NavBar from "./components/NavBar";

import CatalogueQA from "./pages/CatalogueQA";
import ProductDetails from "./pages/ProductDetails";
import Inventory from "./pages/Inventory";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";

import "./App.css";

function App() {
  return (
    <div className="app-layout">

      {/* SIDEBAR */}
      <NavBar />

      {/* MAIN CONTENT */}
      <main className="app-main">
        <Routes>

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* Catalogue */}
          <Route
            path="/"
            element={<CatalogueQA />}
          />

          {/* Product Details */}
          <Route
            path="/products/:id"
            element={<ProductDetails />}
          />

          {/* Stock */}
          <Route
            path="/inventory"
            element={<Inventory />}
          />

          {/* History */}
          <Route
            path="/history"
            element={<History />}
          />

          {/* Unknown route */}
          <Route path="/dashboard" element={<Dashboard />} />

        </Routes>
      </main>

    </div>
  );
}

export default App;