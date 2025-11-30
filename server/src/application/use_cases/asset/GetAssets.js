class GetAssets {
  constructor(assetRepository) {
    this.assetRepository = assetRepository;
  }

  async execute(userId) {
    const assets = await this.assetRepository.findByUserId(userId);
    const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
    return { assets, totalValue };
  }
}

module.exports = GetAssets;
