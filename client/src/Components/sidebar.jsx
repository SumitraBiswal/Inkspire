// src/components/Sidebar/Sidebar.jsx
import React, { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaBook,
  FaThList,
  FaUser,
  FaShoppingCart,
} from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = ({ closeSidebar }) => {
  const sidebarRef = useRef(null);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        closeSidebar();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeSidebar]);

  return (
    <div className="sidebar-wrapper">
      <div className="sidebar-panel" ref={sidebarRef}>
        <ul>
          <li>
            <NavLink to="/home" className="sidebar-link" onClick={closeSidebar}>
              <FaHome className="icon" />
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/library" className="sidebar-link" onClick={closeSidebar}>
              <FaBook className="icon" />
              Library
            </NavLink>
          </li>
          <li>
            <NavLink to="/categories" className="sidebar-link" onClick={closeSidebar}>
              <FaThList className="icon" />
              Categories
            </NavLink>
          </li>
          <li>
            <NavLink to="/profile" className="sidebar-link" onClick={closeSidebar}>
              <FaUser className="icon" />
              Profile
            </NavLink>
          </li>
          <li>
            <NavLink to="/cart" className="sidebar-link" onClick={closeSidebar}>
              <FaShoppingCart className="icon" />
              Cart
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;