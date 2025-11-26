import { createContext, useContext, useState, useEffect } from "react";
import api from "../Api/api";
import { toast } from "react-toastify";

export const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalQuantity: 0, totalPrice: 0 });
  const [loading, setLoading] = useState(false);

  // Fetch cart from backend
  const getCart = async () => {
    setLoading(true);
    try {
      const res = await api.get("/cart/get-cart");
      if (res.data.success) {
        setCart(res.data.cart || { items: [], totalQuantity: 0, totalPrice: 0 });
      }
    } catch (error) {
      console.error("Get Cart Error:", error.response?.data || error.message);
      toast.error("Failed to fetch cart");
      setCart({ items: [], totalQuantity: 0, totalPrice: 0 });
    } finally {
      setLoading(false);
    }
  };

  // Add book to cart
  const addToCart = async (bookId, quantity = 1) => {
    try {
      const res = await api.post("/cart/add-to-cart", { bookId, quantity });
      if (res.data.success) {
       await getCart();
        toast.success("Book added to cart");
      }
    } catch (error) {
      console.error("Add Cart Error:", error.response?.data || error.message);
      toast.error("Failed to add book to cart");
    }
  };

  // Update cart item quantity
  const updateCartItem = async (bookId, quantity) => {
    try {
      if (quantity <= 0) {
        await removeFromCart(bookId);
        return;
      }

      const res = await api.put("/cart/update-cart", { bookId, quantity });
      if (res.data.success) {
        const updatedCart = res.data.cart;

        // Preserve book details for UI
        setCart({
          ...updatedCart,
          items: updatedCart.items.map(item => ({
            ...item,
            book: cart.items.find(b => b.bookId === item.bookId)?.book || item.book
          }))
        });

        toast.info("Cart updated");
      }
    } catch (error) {
      console.error("Update Cart Item Error:", error.response?.data || error.message);
      toast.error("Failed to update cart item");
    }
  };

  // Remove book from cart
  const removeFromCart = async (bookId) => {
    try {
      const res = await api.delete("/cart/remove-from-cart", { data: { bookId } });
      if (res.data.success) {
        setCart(prev => ({
          ...prev,
          items: prev.items.filter(item => item.bookId !== bookId)
        }));
        toast.success("Book removed from cart");
      }
    } catch (error) {
      console.error("Remove Cart Error:", error.response?.data || error.message);
      toast.error("Failed to remove book from cart");
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      const res = await api.delete("/cart/clear-cart");
      if (res.data.success) {
        setCart({ items: [], totalQuantity: 0, totalPrice: 0 });
        toast.success("Cart cleared");
      }
    } catch (error) {
      console.error("Clear Cart Error:", error.response?.data || error.message);
      toast.error("Failed to clear cart");
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        getCart,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;