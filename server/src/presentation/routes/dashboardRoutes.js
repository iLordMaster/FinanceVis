const express = require('express');
const router = express.Router();
const authMiddleware = require('../../../middleware/authMiddleware');

// Dependencies
const MongooseTransactionRepository = require('../../infrastructure/repositories/MongooseTransactionRepository');
const MongooseAccountRepository = require('../../infrastructure/repositories/MongooseAccountRepository');
const MongooseBudgetRepository = require('../../infrastructure/repositories/MongooseBudgetRepository');
const MongooseAssetRepository = require('../../infrastructure/repositories/MongooseAssetRepository');
const DashboardService = require('../../application/services/DashboardService');
const DashboardController = require('../controllers/DashboardController');

// Instantiate dependencies
const transactionRepository = new MongooseTransactionRepository();
const accountRepository = new MongooseAccountRepository();
const budgetRepository = new MongooseBudgetRepository();
const assetRepository = new MongooseAssetRepository();

const dashboardService = new DashboardService({
  transactionRepository,
  accountRepository,
  budgetRepository,
  assetRepository
});

// Instantiate Controller
const dashboardController = new DashboardController(dashboardService);

// Define Routes
router.get('/totals', authMiddleware, (req, res) => dashboardController.getTotals(req, res));
router.get('/monthly-stats', authMiddleware, (req, res) => dashboardController.getMonthlyIncomeVsExpenses(req, res));
router.get('/top-categories', authMiddleware, (req, res) => dashboardController.getTopCategories(req, res));
router.get('/recent-activity', authMiddleware, (req, res) => dashboardController.getRecentActivity(req, res));
router.get('/account-summary', authMiddleware, (req, res) => dashboardController.getAccountSummary(req, res));
router.get('/budget-summary', authMiddleware, (req, res) => dashboardController.getBudgetSummary(req, res));
router.get('/asset-summary', authMiddleware, (req, res) => dashboardController.getAssetSummary(req, res));
router.get('/monthly-stats/specific', authMiddleware, (req, res) => dashboardController.getMonthlyStatsForSpecificMonth(req, res));
router.get('/monthly-stats/all', authMiddleware, (req, res) => dashboardController.getAllMonthlyStats(req, res));

module.exports = router;
