import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaArrowDown } from "react-icons/fa";
import "../Style/BookProfile.css";
import { useCart } from "../../Context/CartContext.jsx";
import { useWishlist } from "../../Context/WishlistContext.jsx";
import api from "../../Api/api.js";

const BookProfile = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const { addToCart } = useCart();
  const { wishlist, addBookToWishlist, removeFromWishlist } = useWishlist();

  // Fetch book details from backend
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await api.get("/books/get");
        const allBooks = res.data.books;

        const foundBook = allBooks.find(
          (b) => b._id === id || b.id === id || b._id?.toString() === id
        );

        setBook(foundBook || null);
      } catch (error) {
        console.error("Fetch error:", error.response?.data || error.message);
      }
    };

    fetchBook();
  }, [id]);

  // Toggle wishlist
  const toggleWishlist = async () => {
    if (!book) return;

    const exists = wishlist.some((b) => b._id === book._id || b.id === book.id);
    if (exists) {
      await removeFromWishlist(book._id || book.id);
    } else {
      await addBookToWishlist(book._id || book.id);
    }
  };

  // Render rating stars
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <>
        {"★".repeat(fullStars)}
        {halfStar && "½"}
        {"☆".repeat(emptyStars)}
      </>
    );
  };

  if (!book) return <p className="loading">Loading book details...</p>;

  const isInWishlist = wishlist.some((b) => b._id === book._id || b.id === book.id);

  return (
    <div className="book-profile-container">
      <div className="book-profile-card">
        <div className="book-image-section">
          <img src={book.image || "/bookimg/placeholder.jpg"} alt={book.title} />
          <div className="image-actions">
            <button
              className={`wishlist-btn ${isInWishlist ? "active" : ""}`}
              onClick={toggleWishlist}
            >
              <FaHeart color={isInWishlist ? "blue" : "gray"} />
            </button>

            <button
              className="cart-btn"
              onClick={() => addToCart(book._id || book.id, 1)}
            >
              <FaShoppingCart /> Add to Cart
            </button>
          </div>
        </div>

        <div className="book-details-section">
          <h2 className="book-title">{book.title}</h2>
          <p className="book-author">By {book.author}</p>

          <div className="book-meta">
            {book.publishedYear && <span className="meta-item">Published: {book.publishedYear}</span>}
            {book.category && <span className="meta-item">Category: {book.category}</span>}
            {book.subcategory && <span className="meta-item">Subcategory: {book.subcategory}</span>}
            {book.pages && <span className="meta-item">Pages: {book.pages}</span>}
            {book.language && <span className="meta-item">Language: {book.language}</span>}
          </div>

          <div className="price-section">
            <span className="price">₹{book.discountPrice}</span>
            <span className="original-price">₹{book.originalPrice}</span>
            {book.discountPercent > 0 && (
              <span className="discount">
                <FaArrowDown className="discount-icon" /> {book.discountPercent}%
              </span>
            )}
          </div>

          <div className="rating">{renderStars(book.rating)}</div>

          <div className="book-description">
            <h3>Description</h3>
            <p>{book.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookProfile;