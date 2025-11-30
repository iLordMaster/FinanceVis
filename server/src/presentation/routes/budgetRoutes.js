const express = require('express');
const router = express.Router();
const authMiddleware = require('../../../middleware/authMiddleware');

// Dependencies
const MongooseBudgetRepository = require('../../infrastructure/repositories/MongooseBudgetRepository');
const CreateBudget = require('../../application/use_cases/budget/CreateBudget');
const GetBudgets = require('../../application/use_cases/budget/GetBudgets');
const UpdateBudget = require('../../application/use_cases/budget/UpdateBudget');
const DeleteBudget = require('../../application/use_cases/budget/DeleteBudget');
const BudgetController = require('../controllers/BudgetController');

// Instantiate dependencies
const budgetRepository = new MongooseBudgetRepository();
const createBudget = new CreateBudget(budgetRepository);
const getBudgets = new GetBudgets(budgetRepository);
const updateBudget = new UpdateBudget(budgetRepository);
const deleteBudget = new DeleteBudget(budgetRepository);

// Instantiate Controller
const budgetController = new BudgetController(
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget
);

// Define Routes
router.post('/', authMiddleware, (req, res) => budgetController.create(req, res));
router.get('/', authMiddleware, (req, res) => budgetController.getAll(req, res));
router.put('/:id', authMiddleware, (req, res) => budgetController.update(req, res));
router.delete('/:id', authMiddleware, (req, res) => budgetController.delete(req, res));

module.exports = router;
