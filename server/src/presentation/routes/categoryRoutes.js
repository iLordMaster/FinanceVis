const express = require('express');
const router = express.Router();
const authMiddleware = require('../../../middleware/authMiddleware');

// Dependencies
const MongooseCategoryRepository = require('../../infrastructure/repositories/MongooseCategoryRepository');
const CreateCategory = require('../../application/use_cases/category/CreateCategory');
const GetCategories = require('../../application/use_cases/category/GetCategories');
const UpdateCategory = require('../../application/use_cases/category/UpdateCategory');
const DeleteCategory = require('../../application/use_cases/category/DeleteCategory');
const CategoryController = require('../controllers/CategoryController');

// Instantiate dependencies
const categoryRepository = new MongooseCategoryRepository();
const createCategory = new CreateCategory(categoryRepository);
const getCategories = new GetCategories(categoryRepository);
const updateCategory = new UpdateCategory(categoryRepository);
const deleteCategory = new DeleteCategory(categoryRepository);

// Instantiate Controller
const categoryController = new CategoryController(
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory
);

// Define Routes
router.post('/', authMiddleware, (req, res) => categoryController.create(req, res));
router.get('/', authMiddleware, (req, res) => categoryController.getAll(req, res));
router.put('/:id', authMiddleware, (req, res) => categoryController.update(req, res));
router.delete('/:id', authMiddleware, (req, res) => categoryController.delete(req, res));

module.exports = router;
