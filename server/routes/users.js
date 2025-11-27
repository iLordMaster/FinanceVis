const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

// Add a new user
router.post("/", async (req, res) => {
	try {
		const { username, email, password } = req.body;

		// Validate required fields
		if (!username || !email || !password) {
			return res.status(400).json({
				message: "Please provide username, email, and password",
			});
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return res.status(400).json({
				message: "Please provide a valid email address",
			});
		}

		// Validate password length
		if (password.length < 6) {
			return res.status(400).json({
				message: "Password must be at least 6 characters long",
			});
		}

		// Check if user already exists
		const existingUser = await User.findOne({
			$or: [{ username }, { email }],
		});

		if (existingUser) {
			if (existingUser.username === username) {
				return res.status(400).json({
					message: "Username already exists",
				});
			}
			if (existingUser.email === email) {
				return res.status(400).json({
					message: "Email already exists",
				});
			}
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create new user
		const user = await User.create({
			username,
			email,
			password: hashedPassword,
		});

		// Return user data (without password)
		res.status(201).json({
			message: "User created successfully",
			user: {
				id: user._id,
				username: user.username,
				email: user.email,
				createdAt: user.createdAt,
			},
		});
	} catch (err) {
		// Handle mongoose validation errors
		if (err.name === "ValidationError") {
			return res.status(400).json({
				message: Object.values(err.errors)
					.map((e) => e.message)
					.join(", "),
			});
		}

		// Handle duplicate key errors
		if (err.code === 11000) {
			const field = Object.keys(err.keyPattern)[0];
			return res.status(400).json({
				message: `${field} already exists`,
			});
		}

		res.status(500).json({
			message: "Error creating user",
			error: err.message,
		});
	}
});

// Get all users (optional - for testing/admin purposes)
router.get("/", async (req, res) => {
	try {
		const users = await User.find().select("-password");
		res.json({
			count: users.length,
			users,
		});
	} catch (err) {
		res.status(500).json({
			message: "Error fetching users",
			error: err.message,
		});
	}
});

// Get a single user by ID
router.get("/:id", authMiddleware, async (req, res) => {
	try {
		const user = await User.findById(req.params.id).select("-password");
		if (!user) {
			return res.status(404).json({
				message: "User not found",
			});
		}
		res.json(user);
	} catch (err) {
		res.status(500).json({
			message: "Error fetching user",
			error: err.message,
		});
	}
});

router.post("/:id/entries", authMiddleware, async (req, res) => {
	try {
		const entry = req.body;

		// Validate input
		if (!entry || Object.keys(entry).length === 0) {
			return res.status(400).json({ message: "Entry data is required" });
		}

		// Find user
		const user = await User.findById(req.params.id).select("-password");
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Push new entry to the user's entries array
		user.entries.push(entry);

		// Save user
		await user.save();

		return res.status(201).json({
			message: "Entry added successfully",
			entry,
		});
	} catch (error) {
		console.error("Error adding entry:", error);

		return res.status(500).json({
			message: "Internal server error",
			error: error.message,
		});
	}
});

router.get("/:id/entries", authMiddleware, async (req, res) => {
	try {
		const user = await User.findById(req.params.id).select("-password");

		if (!user) {
			return res.status(404).json({
				message: "User not found",
			});
		}

		return res.status(200).json({
			message: "Entries fetched successfully",
			entries: user.entries,
		});
	} catch (error) {
		console.error("Error fetching entries:", error);
		return res.status(500).json({
			message: "Internal server error",
			error: error.message,
		});
	}
});

router.get("/:id/entries/:entryId", authMiddleware, async (req, res) => {
	try {
		const user = await User.findById(req.params.id).select("-password");

		if (!user) {
			return res.status(404).json({
				message: "User not found",
			});
		}

		const entry = user.entries.id(req.params.entryId);

		if (!entry) {
			return res.status(404).json({
				message: "Entry not found",
			});
		}

		return res.status(200).json({
			message: "Entry fetched successfully",
			entry,
		});
	} catch (error) {
		console.error("Error fetching entry:", error);
		return res.status(500).json({
			message: "Internal server error",
			error: error.message,
		});
	}
});

// Delete an entry by ID
router.delete("/:id/entries/:entryId", authMiddleware, async (req, res) => {
	try {
		const user = await User.findById(req.params.id).select("-password");

		if (!user) {
			return res.status(404).json({
				message: "User not found",
			});
		}

		const entry = user.entries.id(req.params.entryId);

		if (!entry) {
			return res.status(404).json({
				message: "Entry not found",
			});
		}

		// Remove the entry from the array
		entry.remove();

		// Save the user document
		await user.save();

		return res.status(200).json({
			message: "Entry deleted successfully",
			entryId: req.params.entryId,
		});
	} catch (error) {
		console.error("Error deleting entry:", error);
		return res.status(500).json({
			message: "Internal server error",
			error: error.message,
		});
	}
});

module.exports = router;
