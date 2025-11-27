import React from "react";
import { useCart } from "../../Context/CartContext.jsx";
import "../Style/Cart.css";
import { FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate= useNavigate();
  
   
 
  const {
    cart: { items: cartItems, totalQuantity, totalPrice },
    updateCartItem,
    removeFromCart,
    clearCart,
  } = useCart();

  // Handle quantity change
  const handleQuantityChange = (bookId, newQuantity) => {
    updateCartItem(bookId, newQuantity); 
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your Cart is Empty 🛍️</h2>
        <p>Add some books to your cart to get started!</p>
      </div>
    );
  }
  
  return (
    <div className="cart-wrapper">
      <div className="cart-left">
        <div className="cart-title">
          <h2>My Cart ({totalQuantity})</h2>
          <button
            className="clear-all"
            onClick={() => {
              clearCart();
              toast.info("Cart cleared");
            }}
          >
            Clear All
          </button>
        </div>

        {cartItems.map((item) => {
          const book = item.book; // full book object
          if (!book) return null;

          const subtotal = item.price * item.quantity;
          const discountPercent =
            book.discountPrice && book.originalPrice
              ? Math.round(
                  ((book.originalPrice - book.discountPrice) / book.originalPrice) *
                    100
                )
              : 0;

          return (
            <div className="cart-item" key={item.bookId}>
              <img src={book.image} alt={book.title} className="cart-product-img" />

              <div className="cart-product-details">
                <h3>{book.title}</h3>
                <p className="cart-author">{book.author}</p>

                <div className="cart-price-row">
                  <span className="cart-price">₹{item.price}</span>
                  <span className="cart-original">₹{book.originalPrice}</span>
                  {discountPercent > 0 && (
                    <span className="cart-discount">{discountPercent}% Off</span>
                  )}
                </div>

                <div className="cart-actions">
                  <div className="quantity-control">
                    <button
                      onClick={() =>
                        handleQuantityChange(item.bookId, item.quantity - 1)
                      }
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item.bookId, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>

                  <span className="cart-subtotal">Subtotal: ₹{subtotal}</span>

                  <button
                    className="remove-btn"
                    onClick={() => {
                      removeFromCart(item.bookId);
                 
                    }}
                  >
                    <FaTrashAlt /> Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="cart-right">
        <div className="price-details">
          <h3>PRICE DETAILS</h3>
          <hr />

          <div className="row">
            <span>Price ({totalQuantity} items)</span>
            <span>₹{totalPrice}</span>
          </div>

          <div className="row">
            <span>Delivery Charges</span>
            <span className="free">FREE</span>
          </div>

          <hr />

          <div className="row total-row">
            <span>Total Amount</span>
            <span>₹{totalPrice}</span>
          </div>

          <button className="place-order-btn" onClick={()=>navigate("/address")}>Place Order</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;