import React from "react";
import { NavLink } from "react-router-dom";
import {
  Boxes,
  ClipboardList,
  LayoutDashboard,
  History,
  PackageSearch,
} from "lucide-react";
import "./NavBar.css";

import logo from "../assets/zenve-logo.png";

const links = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/",
    label: "Catalogue",
    icon: ClipboardList,
    end: true,
  },
  {
    to: "/inventory",
    label: "Stock",
    icon: Boxes,
  },
  {
    to: "/history",
    label: "History",
    icon: History,
  },
];

export default function NavBar() {
  return (
    <aside className="side-nav">

      {/* BRAND */}
      <div className="side-brand">
        <div className="brand-mark">
          <img src={logo} alt="Zenve" />
        </div>

        <div className="brand-text">
          <strong>Vendor</strong>
          <span>CONTROL</span>
        </div>
      </div>

      {/* SECTION */}
      <div className="side-section-label">
        Workspace
      </div>

      {/* NAVIGATION */}
      <nav className="side-links">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `side-link ${isActive ? "active" : ""}`
            }
          >
            <Icon size={18} strokeWidth={2.2} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>


    </aside>
  );
}