import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../Context/Authcontext";
import { useNavigate } from "react-router-dom";
import "../Style/home.css";
import { CiSearch } from "react-icons/ci";

import ImageSlider from "./ImageSlider";
import SubCategory from "./SubCategory";
import { SubCategories } from "../../data/subcategory";
import api from "../../Api/api"; // use backend API

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);

  // Fetch all books from backend
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await api.get("/books/get"); // backend route
        if (res.data.success) {
          // Normalize data: ensure _id exists
          const bookList = (res.data.books || []).map((b) => ({
            _id: b._id || b.id,
            id: b._id || b.id,
            title: b.title,
            author: b.author,
            image: b.image,
            rating: b.rating,
            subcategoryId: b.subcategoryId,
            discountPrice: b.discountPrice,
            originalPrice: b.originalPrice,
            discountPercent: b.discountPercent,
          }));
          setBooks(bookList);
        }
      } catch (err) {
        console.error("Failed to fetch books:", err.response?.data || err.message);
      }
    };
    fetchBooks();
  }, []);

  const filteredBooks = books.filter((b) =>
    b.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close search dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const templateImage = [
    "/Booklogo/forscroller3.jpeg",
    "/Booklogo/forscroller6.jpeg",
    "/Booklogo/forscroller5.jpeg",
    "/Booklogo/forscroller2.jpeg",
    "/Booklogo/forscroller4.jpeg",
  ];

  return (
    <div className="home-container">
      <h2 className="home-user">
        Hi! {user?.name?.split(" ")[0] || "User"} 👋
      </h2>

      {/* Flipkart style search */}
      <div className="home-search-container" ref={searchRef}>
        <div className="search-bar">
          <CiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search for Books, Authors, Categories..."
            value={searchTerm}
            onFocus={() => setSearchOpen(true)}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {searchOpen && searchTerm && (
          <div className="suggestion-box">
            {filteredBooks.length === 0 ? (
              <p className="no-result">No results found</p>
            ) : (
              filteredBooks.slice(0, 8).map((b) => (
                <div
                  key={b._id}
                  className="suggestion-item"
                  onClick={() => navigate(`/book/${b._id}`, { state: { book: b } })}
                >
                  <img src={b.image || "/bookimg/placeholder.jpg"} alt={b.title} />
                  <div className="info">
                    <h4>{b.title}</h4>
                    <p className="rating">⭐ {b.rating}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Image slider */}
      <ImageSlider images={templateImage} />

      {/* Subcategories */}
      <div className="subcategory-section">
        {SubCategories.map((sub, idx) => {
          const booksInSub = books.filter((b) => b.subcategoryId === sub.id);
          if (booksInSub.length === 0) return null;
          const theme = idx % 2 === 0 ? "blue" : "orange";
          return (
            <SubCategory
              key={sub.id}
              title={sub.name}
              books={booksInSub}
              view={sub.view}
              theme={theme}
            />
          );
        })}
      </div>
    </div>
  );
}