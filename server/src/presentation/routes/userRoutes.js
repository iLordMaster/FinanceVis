const express = require('express');
const router = express.Router();
const authMiddleware = require('../../../middleware/authMiddleware');
const { upload } = require('../../../config/cloudinaryConfig');

// Dependencies
const MongooseUserRepository = require('../../infrastructure/repositories/MongooseUserRepository');
const GetUserProfile = require('../../application/use_cases/user/GetUserProfile');
const UpdateUserProfile = require('../../application/use_cases/user/UpdateUserProfile');
const UploadProfilePicture = require('../../application/use_cases/user/UploadProfilePicture');
const UserController = require('../controllers/UserController');

// Instantiate dependencies
const userRepository = new MongooseUserRepository();
const getUserProfile = new GetUserProfile(userRepository);
const updateUserProfile = new UpdateUserProfile(userRepository);
const uploadProfilePicture = new UploadProfilePicture(userRepository);

// Instantiate Controller
const userController = new UserController(
  getUserProfile,
  updateUserProfile,
  uploadProfilePicture
);

// Define Routes
router.get('/:id', authMiddleware, (req, res) => userController.getProfile(req, res));
router.put('/:id/profile', authMiddleware, (req, res) => userController.updateProfile(req, res));
router.post('/:id/profile-picture', authMiddleware, upload.single('profilePicture'), (req, res) => userController.uploadPicture(req, res));

module.exports = router;
