const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  type: { type: String, default: "checking" }, // checking, savings, credit, etc.
  balance: { type: Number, default: 0 },
  currency: { type: String, default: "USD" },
  incomeGoal: { type: Number, default: 0 }, // Per-account income goal
  createdAt: { type: Date, default: Date.now },
});

AccountSchema.index({ userId: 1 });
module.exports = mongoose.model("Account", AccountSchema);
