const Asset = require('../../../domain/entities/Asset');

class CreateAsset {
  constructor(assetRepository) {
    this.assetRepository = assetRepository;
  }

  async execute(assetData) {
    const { userId, name, value, color } = assetData;

    if (!name || value === undefined) {
      throw new Error('name and value are required');
    }

    const asset = new Asset({
      userId,
      name,
      value,
      color,
    });

    return await this.assetRepository.create(asset);
  }
}

module.exports = CreateAsset;
