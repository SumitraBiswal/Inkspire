import React, { useState, useEffect } from "react";
import { FaHeart, FaShoppingCart, FaArrowDown } from "react-icons/fa";
import "../Style/Category.css";
import { useCart } from "../../Context/CartContext.jsx";
import { useWishlist } from "../../Context/WishlistContext.jsx";
import { categories } from "../../data/category.js";
import { useNavigate } from "react-router-dom";
import api from "../../Api/api.js";

const Category = () => {
  const [books, setBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categories[0].name);
  const { addToCart } = useCart();
  const { wishlist, addBookToWishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();

  // Fetch books from backend
  const fetchBooks = async () => {
    try {
      const res = await api.get("/books/get"); // Backend route
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

  const filteredBooks = books.filter((book) => book.category === selectedCategory);

  return (
    <div className="category-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <ul>
          {categories.map((cat) => (
            <li
              key={cat.id}
              className={cat.name === selectedCategory ? "active" : ""}
              onClick={() => setSelectedCategory(cat.name)}
            >
              <img src={cat.image} alt={cat.name} />
              <span>{cat.name}</span>
            </li>
          ))}
        </ul>
      </aside>

      {/* Books Section */}
      <main className="books-section">
        <h2>{selectedCategory}</h2>
        <div className="book-grid">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => {
              const isInWishlist = wishlist.some((b) => b._id === book._id);
              return (
                <div className="book-card" key={book._id}>
                  <div className="book-image-container">
                    <img
                      src={book.image || "/bookimg/placeholder.jpg"}
                      alt={book.title}
                      onClick={() => navigate(`/book/${book._id}`, { state: { book } })}
                    />
                    <button
                      className={`wishlist-btn ${isInWishlist ? "active" : ""}`}
                      onClick={() => toggleWishlist(book._id)}
                    >
                      <FaHeart color={isInWishlist ? "blue" : "gray"} />
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
                    <button onClick={() => addToCart(book._id || book.id, 1)} className="cart-icon-btn">
                      <FaShoppingCart />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No books available in this category.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Category;