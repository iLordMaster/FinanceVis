const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema({
	entryAmount: Number,
	entryCat: String,
	entryDate: { type: Date, default: Date.now },
	entryDescription: String,
}, {
	timestamps: true // Adds createdAt and updatedAt fields
});

const userSchema = new mongoose.Schema(
	{
		username: { type: String, required: true, unique: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		entries: { type: [entrySchema], required: false, default: [] },
	},
	{
		timestamps: true, // Adds createdAt and updatedAt fields
	}
);

module.exports = mongoose.model("User", userSchema);
