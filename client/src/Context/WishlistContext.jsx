import { createContext, useContext, useState, useEffect } from "react";
import api from "../Api/api";
import { toast } from "react-toastify";
import { useCart } from "./CartContext";

const WishlistContext = createContext();
export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();

  // Fetch wishlist from backend
  const getWishlist = async () => {
    setLoading(true);
    try {
      const res = await api.get("/wishlist/get");
      // Normalize wishlist: always ensure _id exists for React keys
      const list = (res.data.wishlist || []).map((b) => ({
        _id: b._id || b.id,
        id: b._id || b.id,
        title: b.title,
        author: b.author,
        image: b.image,
        originalPrice: b.originalPrice,
        discountPrice: b.discountPrice,
      }));
      setWishlist(list);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch wishlist");
    } finally {
      setLoading(false);
    }
  };

  // Add book to wishlist
  const addBookToWishlist = async (bookId) => {
    try {
      // Check if book already exists locally
      const exists = wishlist.some((b) => b._id === bookId || b.id === bookId);
      if (exists) {
        toast.info("Book already in wishlist");
        return;
      }

      const res = await api.post("/wishlist/add", { bookId });
      if (res.data.success) {
        // Immediately update local state
        setWishlist((prev) => [...prev, { _id: bookId, id: bookId }]);
        toast.success("Book added to wishlist");
      } else {
        toast.info(res.data.message || "Already in wishlist");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add to wishlist");
    }
  };

  // Remove book from wishlist
  const removeFromWishlist = async (bookId) => {
    try {
      const res = await api.delete("/wishlist/remove", { data: { bookId } });
      if (res.data.success) {
        setWishlist((prev) => prev.filter((b) => b._id !== bookId && b.id !== bookId));
        toast.success("Book removed from wishlist");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove book");
    }
  };

  // Move book from wishlist to cart
  const moveToCart = async (bookId) => {
    try {
      await addToCart(bookId, 1);       // Add to cart
      await removeFromWishlist(bookId);  // Remove from wishlist
      toast.success("Book moved to cart");
    } catch (error) {
      console.error(error);
      toast.error("Failed to move book to cart");
    }
  };

  useEffect(() => {
    getWishlist();
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        getWishlist,
        addBookToWishlist,
        removeFromWishlist,
        moveToCart,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;