const express = require('express');
const router = express.Router();
const authMiddleware = require('../../../middleware/authMiddleware');

// Dependencies
const MongooseTransactionRepository = require('../../infrastructure/repositories/MongooseTransactionRepository');
const CreateTransaction = require('../../application/use_cases/transaction/CreateTransaction');
const GetTransactions = require('../../application/use_cases/transaction/GetTransactions');
const GetTransactionSummary = require('../../application/use_cases/transaction/GetTransactionSummary');
const DeleteTransaction = require('../../application/use_cases/transaction/DeleteTransaction');
const TransactionController = require('../controllers/TransactionController');

// Instantiate dependencies
const transactionRepository = new MongooseTransactionRepository();
const createTransaction = new CreateTransaction(transactionRepository);
const getTransactions = new GetTransactions(transactionRepository);
const getTransactionSummary = new GetTransactionSummary(transactionRepository);
const deleteTransaction = new DeleteTransaction(transactionRepository);

// Instantiate Controller
const transactionController = new TransactionController(
  createTransaction,
  getTransactions,
  getTransactionSummary,
  deleteTransaction
);

// Define Routes
router.post('/', authMiddleware, (req, res) => transactionController.create(req, res));
router.get('/', authMiddleware, (req, res) => transactionController.getAll(req, res));
router.get('/summary', authMiddleware, (req, res) => transactionController.getSummary(req, res));
router.delete('/:id', authMiddleware, (req, res) => transactionController.delete(req, res));

module.exports = router;
