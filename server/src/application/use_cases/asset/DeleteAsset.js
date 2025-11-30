class DeleteAsset {
  constructor(assetRepository) {
    this.assetRepository = assetRepository;
  }

  async execute(id, userId) {
    const asset = await this.assetRepository.findById(id);
    if (!asset) {
      throw new Error('Asset not found');
    }
    if (asset.userId !== userId) {
      throw new Error('Unauthorized');
    }
    return await this.assetRepository.deleteById(id);
  }
}

module.exports = DeleteAsset;
