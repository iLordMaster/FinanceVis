const mongoose = require("mongoose");
const CategoryModel = require("./src/infrastructure/database/models/CategoryModel");
require("dotenv").config();

const defaultCategories = [
  // Income
  { name: "Salary", type: "INCOME", icon: "💼", color: "#10b981" },
  { name: "Freelance", type: "INCOME", icon: "💻", color: "#3b82f6" },
  { name: "Gift", type: "INCOME", icon: "🎁", color: "#ec4899" },
  { name: "Others", type: "INCOME", icon: "💰", color: "#8b5cf6" },
  // Expense
  { name: "Housing", type: "EXPENSE", icon: "🏠", color: "#ef4444" },
  { name: "Transportation", type: "EXPENSE", icon: "🚗", color: "#f59e0b" },
  { name: "Food & Dining", type: "EXPENSE", icon: "🍔", color: "#84cc16" },
  { name: "Healthcare", type: "EXPENSE", icon: "⚕️", color: "#06b6d4" },
  { name: "Entertainment", type: "EXPENSE", icon: "🎮", color: "#8b5cf6" },
  { name: "Shopping", type: "EXPENSE", icon: "🛍️", color: "#ec4899" },
  { name: "Bills & Utilities", type: "EXPENSE", icon: "📄", color: "#6366f1" },
  { name: "Education", type: "EXPENSE", icon: "📚", color: "#14b8a6" },
  { name: "Personal Care", type: "EXPENSE", icon: "💅", color: "#a855f7" },
  { name: "Others", type: "EXPENSE", icon: "📦", color: "#64748b" },
];

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Check if categories exist
    const count = await CategoryModel.countDocuments();
    if (count > 0) {
      console.log("Categories already exist. Skipping seed.");
    } else {
      await CategoryModel.insertMany(defaultCategories);
      console.log("Categories seeded successfully");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error seeding categories:", error);
    process.exit(1);
  }
};

seedCategories();
