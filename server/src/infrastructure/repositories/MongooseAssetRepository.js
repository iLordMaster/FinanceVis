const AssetRepository = require('../../domain/repositories/AssetRepository');
const AssetModel = require('../database/models/AssetModel');
const Asset = require('../../domain/entities/Asset');

class MongooseAssetRepository extends AssetRepository {
  async create(asset) {
    const newAsset = new AssetModel({
      userId: asset.userId,
      name: asset.name,
      value: asset.value,
      color: asset.color,
    });
    const savedAsset = await newAsset.save();
    return this._toEntity(savedAsset);
  }

  async findByUserId(userId) {
    const assets = await AssetModel.find({ userId }).sort({ createdAt: -1 });
    return assets.map(this._toEntity);
  }

  async findById(id) {
    const asset = await AssetModel.findById(id);
    if (!asset) return null;
    return this._toEntity(asset);
  }

  async update(id, updates) {
    const asset = await AssetModel.findByIdAndUpdate(id, updates, { new: true });
    if (!asset) return null;
    return this._toEntity(asset);
  }

  async deleteById(id) {
    const asset = await AssetModel.findByIdAndDelete(id);
    return !!asset;
  }

  _toEntity(mongoAsset) {
    return new Asset({
      id: mongoAsset._id.toString(),
      userId: mongoAsset.userId.toString(),
      name: mongoAsset.name,
      value: mongoAsset.value,
      color: mongoAsset.color,
      createdAt: mongoAsset.createdAt,
    });
  }
}

module.exports = MongooseAssetRepository;
