const express = require('express');
const router = express.Router();
const authMiddleware = require('../../../middleware/authMiddleware');

// Dependencies
const MongooseAccountRepository = require('../../infrastructure/repositories/MongooseAccountRepository');
const CreateAccount = require('../../application/use_cases/account/CreateAccount');
const GetAccounts = require('../../application/use_cases/account/GetAccounts');
const UpdateAccount = require('../../application/use_cases/account/UpdateAccount');
const DeleteAccount = require('../../application/use_cases/account/DeleteAccount');
const AccountController = require('../controllers/AccountController');

// Instantiate dependencies
const accountRepository = new MongooseAccountRepository();
const createAccount = new CreateAccount(accountRepository);
const getAccounts = new GetAccounts(accountRepository);
const updateAccount = new UpdateAccount(accountRepository);
const deleteAccount = new DeleteAccount(accountRepository);

// Instantiate Controller
const accountController = new AccountController(
  createAccount,
  getAccounts,
  updateAccount,
  deleteAccount
);

// Define Routes
router.post('/', authMiddleware, (req, res) => accountController.create(req, res));
router.get('/', authMiddleware, (req, res) => accountController.getAll(req, res));
router.put('/:id', authMiddleware, (req, res) => accountController.update(req, res));
router.delete('/:id', authMiddleware, (req, res) => accountController.delete(req, res));

module.exports = router;
