import React from "react";
import { ArrowRight, Boxes, ClipboardList, History, PackageCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  return (
    <main className="dashboard-page">
      <section className="dashboard-hero">
        <div>
          <span className="eyebrow">VENDOR CONTROL / OVERVIEW</span>
          <h1>A calmer way to manage stock.</h1>
          <p>Jump straight into your catalogue, stock operations, or movement history without changing the backend workflow.</p>
        </div>
      </section>

      <section className="dash-grid">
        <Link className="dash-card orange" to="/">
          <div className="dash-card-top"><span>01</span><ClipboardList size={23} /></div>
          <h2>Catalogue</h2>
          <p>Browse, search and manage your product catalogue.</p>
          <span className="dash-action">Open catalogue <ArrowRight size={16} /></span>
        </Link>
        <Link className="dash-card blue" to="/inventory">
          <div className="dash-card-top"><span>02</span><Boxes size={23} /></div>
          <h2>Stock</h2>
          <p>Review stock levels and handle inventory operations.</p>
          <span className="dash-action">Open stock <ArrowRight size={16} /></span>
        </Link>
        <Link className="dash-card green" to="/history">
          <div className="dash-card-top"><span>03</span><History size={23} /></div>
          <h2>History</h2>
          <p>Follow stock movements and see what changed over time.</p>
          <span className="dash-action">View history <ArrowRight size={16} /></span>
        </Link>
      </section>

  
    </main>
  );
}
