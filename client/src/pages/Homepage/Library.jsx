import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaArrowDown } from "react-icons/fa";
import "../Style/Library.css";
import { useCart } from "../../Context/CartContext.jsx";
import { useWishlist } from "../../Context/WishlistContext.jsx";
import api from "../../Api/api.js";

const Library = () => {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { wishlist, addBookToWishlist, removeFromWishlist } = useWishlist();

  const fetchBooks = async () => {
    try {
      const res = await api.get("/books/get"); // Fetch from backend
      if (res.data.success) {
        setBooks(res.data.books || []);
      }
    } catch (error) {
      console.error("Error fetching books:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const toggleWishlist = (bookId) => {
    const exists = wishlist.find((b) => b._id === bookId);
    if (exists) {
      removeFromWishlist(bookId);
    } else {
      addBookToWishlist(bookId);
    }
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
      <span className="stars">
        {"★".repeat(fullStars)}
        {halfStar && "½"}
        {"☆".repeat(emptyStars)}
      </span>
    );
  };

  return (
    <div className="library-container">
      <h2>Explore Our Library</h2>
      <div className="book-grid">
        {books.length > 0 ? (
          books.map((book) => (
            <div className="book-card" key={book._id}>
              <div className="book-image-container">
                <img
                  src={book.image || "/bookimg/placeholder.jpg"}
                  alt={book.title}
                  onClick={() => navigate(`/book/${book._id}`)}
                />
                <button
                  className={`wishlist-btn ${wishlist.some((b) => b._id === book._id) ? "active" : ""}`}
                  onClick={() => toggleWishlist(book._id)}
                >
                  <FaHeart />
                </button>
              </div>

              <div className="book-info">
                <h3>{book.title}</h3>
                <p>{book.author}</p>
                <div className="price-row">
                  <span className="price">₹{book.discountPrice}</span>
                  <span className="original-price">₹{book.originalPrice}</span>
                  {book.discountPercent > 0 && (
                    <span className="discount">
                      <FaArrowDown className="discount-icon" /> {book.discountPercent}%
                    </span>
                  )}
                  {book.subcategory && <span className="badge">{book.subcategory}</span>}
                </div>
                <div className="rating">{renderStars(book.rating)}</div>
              </div>

              <div className="book-actions">
                <button onClick={() => addToCart(book._id ||book.id, 1)} className="cart-icon-btn">
                  <FaShoppingCart />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="loading">Loading books...</p>
        )}
      </div>
    </div>
  );
};

export default Library;