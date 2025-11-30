const express = require('express');
const router = express.Router();
const authMiddleware = require('../../../middleware/authMiddleware');

// Dependencies
const MongooseUserRepository = require('../../infrastructure/repositories/MongooseUserRepository');
const MongooseCategoryRepository = require('../../infrastructure/repositories/MongooseCategoryRepository');
const BcryptAuthService = require('../../infrastructure/services/BcryptAuthService');
const JwtTokenService = require('../../infrastructure/services/JwtTokenService');
const RegisterUser = require('../../application/use_cases/auth/RegisterUser');
const LoginUser = require('../../application/use_cases/auth/LoginUser');
const AuthController = require('../controllers/AuthController');

// Instantiate dependencies
const userRepository = new MongooseUserRepository();
const categoryRepository = new MongooseCategoryRepository();
const authService = new BcryptAuthService();
const tokenService = new JwtTokenService(process.env.JWT_SECRET);

// Instantiate Use Cases
const registerUserUseCase = new RegisterUser(userRepository, categoryRepository, authService, tokenService);
const loginUserUseCase = new LoginUser(userRepository, authService, tokenService);

// Instantiate Controller
const authController = new AuthController(registerUserUseCase, loginUserUseCase);

// Define Routes
router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.get('/me', authMiddleware, (req, res) => authController.getMe(req, res));

module.exports = router;
