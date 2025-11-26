import React, { useEffect } from "react";
import "../Style/Wishlist.css";
import { useWishlist } from "../../Context/WishlistContext.jsx";
import { useCart } from "../../Context/CartContext.jsx";

const Wishlist = () => {
  const { wishlist, getWishlist, removeFromWishlist } = useWishlist();
  const { addToCart, getCart } = useCart();

  useEffect(() => {
    getWishlist();
  }, []);

  if (!wishlist.length) {
    return <h2 className="wishlist-empty">Your Wishlist is Empty ❤️</h2>;
  }

  const handleMoveToCart = async (book) => {
    await addToCart(book.id, 1);
    removeFromWishlist(book.id);
    getCart();
  };

  return (
    <div className="wishlist-container">
      <h2 className="wishlist-heading">My Wishlist</h2>
      <div className="wishlist-grid">
        {wishlist.map((book) => (
          <div key={book.id} className="wishlist-card">
            <img src={book.image} alt={book.title} />
           
            <div className="wishlist-info">
                <h3>{book.title}</h3>
                <p className="author">{book.author}</p>
            </div>
            

            <div className="wishlist-btns">
              <button onClick={() => handleMoveToCart(book)}>
                Move to Cart
              </button>
              <button onClick={() => removeFromWishlist(book.id)}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;