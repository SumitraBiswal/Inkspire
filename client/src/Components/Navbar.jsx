// src/components/Navbar/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaSearch, FaBars, FaHome, FaBook, FaThList, FaUser, FaShoppingCart } from "react-icons/fa";


import "./navbar.css";
import { useAuth } from "../Context/Authcontext";
import Sidebar from "./sidebar";

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const searchRef = useRef(null);

  // Fetch book suggestions
  useEffect(() => {
    fetch("/book.json")
      .then((res) => res.json())
      .then((data) => setSuggestions(data))
      .catch((err) => console.error("Error loading book data:", err));
  }, []);

  // Close search if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = () => {
    if (searchTerm.trim()) navigate(`/search?query=${searchTerm}`);
  };

  const filteredSuggestions = suggestions.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* 🔹 Top Navbar */}
      <nav className="navbar">
        {/* Left: Logo */}
        <div className="logo">
          <NavLink to="/">Inkspire</NavLink>
        </div>

        {/* Center Nav Links (desktop only) */}
        <ul className="nav-links">
          <li>
            <NavLink to="/home" className="nav-item">Home</NavLink>
          </li>
          <li>
            <NavLink to="/categories" className="nav-item">Categories</NavLink>
          </li>
          <li>
            <NavLink to="/library" className="nav-item">Library</NavLink>
          </li>
        </ul>

        {/* Right Actions */}
        <div className="nav-actions" ref={searchRef}>
          {/* Search */}
          <div className={`search-container ${searchOpen ? "active" : ""}`}>
            {searchOpen && (
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search for books..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={handleSearchSubmit}>Search</button>
                {searchTerm && (
                  <ul className="suggestions">
                    {filteredSuggestions.slice(0, 5).map((book, index) => (
                      <li key={index} onClick={() => navigate(`/book/${book.id}`)}>
                        {book.title}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            <FaSearch className="icon" onClick={() => setSearchOpen(!searchOpen)} />
          </div>

       {/* 🔹 User Profile */}
          {user ? (
            <div
              className="user-initial"
              onClick={() => navigate("/profile")}
              title={user?.name || "Profile"}
            >
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          ) : (
            <FaUser
              className="icon"
              onClick={() => navigate("/login")}
              title="Login"
            />
          )}

          {/* Sidebar */}
          <FaBars className="icon-sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)} />
        </div>
      </nav>

      {/* 🔹 Bottom Button Navbar (Mobile Only) */}
      <div className="bottom-navbar">
        <NavLink to="/home" className="bottom-icon">
          <FaHome />
          <span>Home</span>
        </NavLink>
        <NavLink to="/library" className="bottom-icon">
          <FaBook />
          <span>Library</span>
        </NavLink>
        <NavLink to="/categories" className="bottom-icon">
          <FaThList />
          <span>Categories</span>
        </NavLink>
        <NavLink to="/profile" className="bottom-icon">
          <FaUser />
          <span>Profile</span>
        </NavLink>
        <NavLink to="/cart" className="bottom-icon">
          <FaShoppingCart />
          <span>Cart</span>
        </NavLink>
      </div>

      {/* Sidebar (right side for desktop) */}
      {sidebarOpen && <Sidebar closeSidebar={() => setSidebarOpen(false)} />}
    </>
  );
};

export default Navbar;