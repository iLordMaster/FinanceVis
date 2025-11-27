const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
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
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
	res.send("Server running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
