import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import Book from "./models/bookModel.js";

dotenv.config();

// Fix __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Correct path to book.json
const filePath = path.resolve(__dirname, "../client/public/book.json");

const seedBooks = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected");

    const rawData = fs.readFileSync(filePath, "utf-8");
    const books = JSON.parse(rawData);

    await Book.insertMany(books);
    console.log("Books inserted successfully!");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding books:", error.message);
    process.exit(1);
  }
};

seedBooks();