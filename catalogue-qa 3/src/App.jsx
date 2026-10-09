import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import CatalogueQA from "./pages/CatalogueQA";
import ProductDetails from "./pages/ProductDetails";
import Inventory from "./pages/Inventory";
import "./App.css";

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<CatalogueQA />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/inventory" element={<Inventory />} />
      </Routes>
    </>
  );
}

export default App;