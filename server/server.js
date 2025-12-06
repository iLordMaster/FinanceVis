const express = require("express");
const cors = require("cors");
const connectDB = require("./src/infrastructure/database/mongoose"); // Updated path
require("dotenv").config();
const morgan = require("morgan");

const app = express();

// Morgan logging
app.use(morgan("dev"));

// Proper CORS configuration
app.use(
	cors({
		origin: "*",
		credentials: true,
	})
);

// Parse JSON
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
const authRoutes = require("./src/presentation/routes/authRoutes"); // New Auth Routes
const transactionRoutes = require("./src/presentation/routes/transactionRoutes"); // New Transaction Routes
const categoryRoutes = require("./src/presentation/routes/categoryRoutes"); // New Category Routes
const accountRoutes = require("./src/presentation/routes/accountRoutes"); // New Account Routes
const usersRoutes = require("./src/presentation/routes/userRoutes"); // New User Routes
const budgetRoutes = require("./src/presentation/routes/budgetRoutes"); // New Budget Routes
const assetRoutes = require("./src/presentation/routes/assetRoutes"); // New Asset Routes
const notificationRoutes = require("./src/presentation/routes/notificationRoutes"); // New Notification Routes
const dashboardRoutes = require("./src/presentation/routes/dashboardRoutes"); // New Dashboard Routes

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
	res.send("Server running");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
