import React from "react";
import { History as HistoryIcon } from "lucide-react";
import InventoryHistory from "../components/InventoryHistory";
import "./History.css";

export default function History() {
  return (
    <main className="history-page">
      <header className="history-header">
        <div>
          <span className="eyebrow">ACTIVITY LOG</span>
          <h1>Stock history</h1>
          <p>Every inventory movement in one clean timeline.</p>
        </div>
        {/* <div className="history-mark"><HistoryIcon size={24} /></div> */}
      </header>
      <section className="history-panel">
        <InventoryHistory />
      </section>
    </main>
  );
}
