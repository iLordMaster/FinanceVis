const express = require('express');
const router = express.Router();
const authMiddleware = require('../../../middleware/authMiddleware');

// Dependencies
const MongooseAssetRepository = require('../../infrastructure/repositories/MongooseAssetRepository');
const CreateAsset = require('../../application/use_cases/asset/CreateAsset');
const GetAssets = require('../../application/use_cases/asset/GetAssets');
const UpdateAsset = require('../../application/use_cases/asset/UpdateAsset');
const DeleteAsset = require('../../application/use_cases/asset/DeleteAsset');
const AssetController = require('../controllers/AssetController');

// Instantiate dependencies
const assetRepository = new MongooseAssetRepository();
const createAsset = new CreateAsset(assetRepository);
const getAssets = new GetAssets(assetRepository);
const updateAsset = new UpdateAsset(assetRepository);
const deleteAsset = new DeleteAsset(assetRepository);

// Instantiate Controller
const assetController = new AssetController(
  createAsset,
  getAssets,
  updateAsset,
  deleteAsset
);

// Define Routes
router.post('/', authMiddleware, (req, res) => assetController.create(req, res));
router.get('/', authMiddleware, (req, res) => assetController.getAll(req, res));
router.put('/:id', authMiddleware, (req, res) => assetController.update(req, res));
router.delete('/:id', authMiddleware, (req, res) => assetController.delete(req, res));

module.exports = router;
