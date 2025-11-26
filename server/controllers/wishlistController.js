import Wishlist from "../models/wishlistModel.js";
import Book from "../models/bookModel.js";
import mongoose from "mongoose";

// ADD TO WISHLIST
export const addToWishlist = async (req, res) => {
  try {
    const userId = req.userId;
    const { bookId } = req.body;

    if (!bookId) return res.status(400).json({ success: false, message: "bookId required" });

    // Find the book by MongoDB _id or custom id
    let book;
    if (mongoose.Types.ObjectId.isValid(bookId)) {
      book = await Book.findById(bookId);
    }
    if (!book) {
      book = await Book.findOne({ id: bookId });
    }
    if (!book) return res.status(404).json({ success: false, message: "Book not found" });

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, book: [book._id ? book._id.toString() : book.id] });
      return res.status(201).json({ success: true, message: "Added to wishlist", wishlist });
    }

    // Check if already in wishlist
    const exists = wishlist.book.some(id => id.toString() === (book._id ? book._id.toString() : book.id));
    if (exists) return res.status(400).json({ success: false, message: "Already exists" });

    wishlist.book.push(book._id ? book._id.toString() : book.id);
    await wishlist.save();

    res.status(200).json({ success: true, message: "Added to wishlist", wishlist });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// REMOVE FROM WISHLIST
export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.userId;
     const { bookId } = req.body;

    if (!bookId)
      return res.status(400).json({ success: false, message: "bookId required" });

    // STEP 1: find the actual book document
    let book;
    if (mongoose.Types.ObjectId.isValid(bookId)) {
      book = await Book.findById(bookId);
    }
    if (!book) {
      book = await Book.findOne({ id: bookId });
    }
    if (!book)
      return res.status(404).json({ success: false, message: "Book not found" });

    // The stored ID format
    const storedId = book._id ? book._id.toString() : book.id;

    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist)
      return res.status(404).json({ success: false, message: "Wishlist not found" });

    // STEP 2: remove the correct ID
    const beforeCount = wishlist.book.length;

    wishlist.book = wishlist.book.filter(
      (id) => id.toString() !== storedId
    );

    // Nothing removed?
    if (wishlist.book.length === beforeCount) {
      return res.status(400).json({ success: false, message: "Item not found in wishlist" });
    }

    await wishlist.save();

    res.status(200).json({ success: true, message: "Removed from wishlist", wishlist });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET WISHLIST
export const getWishlist = async (req, res) => {
  try {
    const userId = req.userId;
    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) return res.status(200).json({ success: true, wishlist: [] });

    // Populate book details manually (support both MongoDB _id and custom id)
    const booksWithDetails = await Promise.all(
      wishlist.book.map(async itemId => {
        let book;
        if (mongoose.Types.ObjectId.isValid(itemId)) {
          book = await Book.findById(itemId);
        }
        if (!book) {
          book = await Book.findOne({ id: itemId });
        }
        return book
          ? {
              id: book._id ? book._id.toString() : book.id,
              title: book.title,
              author: book.author,
              originalPrice: book.originalPrice,
              discountPrice: book.discountPrice,
              image: book.image,
            }
          : null;
      })
    );

    res.status(200).json({ success: true, wishlist: booksWithDetails.filter(Boolean) });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};