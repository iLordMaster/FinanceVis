const express = require("express");
const router = express.Router();
const authMiddleware = require("../../../middleware/authMiddleware");

// Dependencies
const MongooseRecurringTransactionRepository = require("../../infrastructure/repositories/MongooseRecurringTransactionRepository");
const CreateRecurringTransaction = require("../../application/use_cases/recurring_transaction/CreateRecurringTransaction");
const GetRecurringTransactions = require("../../application/use_cases/recurring_transaction/GetRecurringTransactions");
const UpdateRecurringTransaction = require("../../application/use_cases/recurring_transaction/UpdateRecurringTransaction");
const DeleteRecurringTransaction = require("../../application/use_cases/recurring_transaction/DeleteRecurringTransaction");
const RecurringTransactionController = require("../controllers/RecurringTransactionController");

// Instantiate dependencies
const recurringTransactionRepository =
  new MongooseRecurringTransactionRepository();
const createRecurringTransaction = new CreateRecurringTransaction(
  recurringTransactionRepository
);
const getRecurringTransactions = new GetRecurringTransactions(
  recurringTransactionRepository
);
const updateRecurringTransaction = new UpdateRecurringTransaction(
  recurringTransactionRepository
);
const deleteRecurringTransaction = new DeleteRecurringTransaction(
  recurringTransactionRepository
);

// Instantiate Controller
const recurringTransactionController = new RecurringTransactionController(
  createRecurringTransaction,
  getRecurringTransactions,
  updateRecurringTransaction,
  deleteRecurringTransaction
);

// Define Routes
router.post("/", authMiddleware, (req, res) =>
  recurringTransactionController.create(req, res)
);
router.get("/", authMiddleware, (req, res) =>
  recurringTransactionController.getAll(req, res)
);
router.put("/:id", authMiddleware, (req, res) =>
  recurringTransactionController.update(req, res)
);
router.delete("/:id", authMiddleware, (req, res) =>
  recurringTransactionController.delete(req, res)
);

module.exports = router;
