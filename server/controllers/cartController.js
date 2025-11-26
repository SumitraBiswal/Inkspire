import Cart from "../models/cartModel.js";
import Book from "../models/bookModel.js";
import mongoose from "mongoose";


// Add a book to cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.userId; 
    if (!userId) return res.json({ success: false, message: "User not authenticated" });

    const { bookId, quantity = 1 } = req.body;
    const quantityNumber = Number(quantity) || 1;

    //use if statment to fetch mongodb id either bookid 
    //try to finf by mongodb id
    let book;
    if(mongoose.Types.ObjectId.isValid(bookId)){
       book = await Book.findById(bookId);
    }

    //if not found mongodbid then fallback to fetch to json id

    if(!book){
      book = await Book.findOne({id:bookId});
    }

    
    if (!book) return res.json({ success: false, message: "Book not found" });

    const price = book.discountPrice || book.originalPrice || 0;

    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, items: [] });

    const existingItem = cart.items.find(item => item.bookId===(book._id.toString()||book.id) );
    if (existingItem) {
      existingItem.quantity += quantityNumber;
      existingItem.price = price; // Update price safely
    } else {
      cart.items.push({ bookId:book._id?book._id.toString():book.id, quantity: quantityNumber, price });
    }

    await cart.save();
    res.json({ success: true, message: "Book added to cart", cart });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Get user's cart
export const getCart = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.json({ success: false, message: "User not authenticated" });
  

    const cart = await Cart.findOne({ userId });
    if(!cart)return res.json({sucess:true ,cart:{items:[]}});

    //add bookdetails 
    const itemsWithDetails = await Promise.all(cart.items.map(async(item)=>{let book ;
      if(mongoose.Types.ObjectId.isValid(item.bookId)){
        book = await Book.findById(item.bookId);
      }
         if(!book){
          book = await Book.findOne({id:item.bookId})
        }
        return {
          ...item.toObject(),
          book:book
          ?{
            title:book.title,
            author:book.author,
            originalPrice:book.originalPrice,
            discountPrice:book.discountPrice,
            image:book.image,

          }
          :null,
        };
    }));
      
    res.json({ success: true, cart :{...cart.toObject(),items:itemsWithDetails}});
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Update quantity of a book in cart
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.userId;
    const { bookId, quantity } = req.body;

    if (!bookId)
      return res.json({ success: false, message: "bookId required" });

    const quantityNumber = Number(quantity);

    let book;
    if (mongoose.Types.ObjectId.isValid(bookId)) {
      book = await Book.findById(bookId);
    }
    if (!book) {
      book = await Book.findOne({ id: bookId });
    }
    if (!book)
      return res.json({ success: false, message: "Book not found" });

    const storedId = book._id ? book._id.toString() : book.id;

    const cart = await Cart.findOne({ userId });
    if (!cart)
      return res.json({ success: false, message: "Cart is empty" });

    const itemIndex = cart.items.findIndex(
      (item) => item.bookId.toString() === storedId
    );

    if (itemIndex === -1)
      return res.json({ success: false, message: "Book not found in cart" });

    // Remove if qty < 1
    if (quantityNumber < 1) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantityNumber;
    }

    await cart.save();

    res.json({
      success: true,
      message: quantityNumber < 1 ? "Book removed" : "Cart updated",
      cart,
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Remove a book from cart
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { bookId } = req.body;

    if (!userId)
      return res.json({ success: false, message: "User not authenticated" });

    if (!bookId)
      return res.json({ success: false, message: "bookId required" });

    // STEP 1: Find the actual book document
    let book;
    if (mongoose.Types.ObjectId.isValid(bookId)) {
      book = await Book.findById(bookId);
    }
    if (!book) {
      book = await Book.findOne({ id: bookId });
    }
    if (!book)
      return res.json({ success: false, message: "Book not found" });

    // The correct stored ID inside cart
    const storedId = book._id ? book._id.toString() : book.id;

    // STEP 2: Get cart
    const cart = await Cart.findOne({ userId });
    if (!cart)
      return res.json({ success: false, message: "Cart not found" });

    const beforeCount = cart.items.length;

    // STEP 3: Remove matching ID
    cart.items = cart.items.filter(
      (item) => item.bookId.toString() !== storedId
    );

    if (beforeCount === cart.items.length) {
      return res.json({
        success: false,
        message: "Item not found in cart",
      });
    }

    await cart.save();

    res.json({ success: true, message: "Book removed from cart", cart });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Clear entire cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.userId;
    await Cart.findOneAndDelete({ userId });
    res.json({ success: true, message: "Cart cleared", cart: { items: [] } });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};