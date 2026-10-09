import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/zenve-logo.png";

const NavBar = () => {
  return (
    <nav className="top-nav">
      <div className="brand-wrap">
        <img src={logo} alt="Zenve Fashion" className="brand-logo" />
      
      </div>

      <div className="top-nav-links">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? "top-link top-link-active" : "top-link"
          }
        >
          Catalogue
        </NavLink>
        <NavLink
          to="/inventory"
          className={({ isActive }) =>
            isActive ? "top-link top-link-active" : "top-link"
          }
        >
          Inventory
        </NavLink>
      </div>
    </nav>
  );
};

export default NavBar;