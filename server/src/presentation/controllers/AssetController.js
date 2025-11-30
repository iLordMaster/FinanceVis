class AssetController {
  constructor(createAsset, getAssets, updateAsset, deleteAsset) {
    this.createAsset = createAsset;
    this.getAssets = getAssets;
    this.updateAsset = updateAsset;
    this.deleteAsset = deleteAsset;
  }

  async create(req, res) {
    try {
      const assetData = {
        userId: req.user.id,
        ...req.body
      };
      const result = await this.createAsset.execute(assetData);
      res.status(201).json({
        message: "Asset created successfully",
        asset: result,
      });
    } catch (err) {
      if (err.message.includes('required')) {
        res.status(400).json({ message: err.message });
      } else {
        console.error(err);
        res.status(500).json({ message: 'Error creating asset', error: err.message });
      }
    }
  }

  async getAll(req, res) {
    try {
      const { assets, totalValue } = await this.getAssets.execute(req.user.id);
      res.json({
        count: assets.length,
        totalValue,
        assets,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error fetching assets', error: err.message });
    }
  }

  async update(req, res) {
    try {
      const result = await this.updateAsset.execute(req.params.id, req.user.id, req.body);
      res.json({
        message: "Asset updated successfully",
        asset: result,
      });
    } catch (err) {
      if (err.message === 'Asset not found') {
        res.status(404).json({ message: err.message });
      } else if (err.message === 'Unauthorized') {
        res.status(403).json({ message: err.message });
      } else {
        console.error(err);
        res.status(500).json({ message: 'Error updating asset', error: err.message });
      }
    }
  }

  async delete(req, res) {
    try {
      await this.deleteAsset.execute(req.params.id, req.user.id);
      res.json({
        message: "Asset deleted successfully",
        assetId: req.params.id,
      });
    } catch (err) {
      if (err.message === 'Asset not found') {
        res.status(404).json({ message: err.message });
      } else if (err.message === 'Unauthorized') {
        res.status(403).json({ message: err.message });
      } else {
        console.error(err);
        res.status(500).json({ message: 'Error deleting asset', error: err.message });
      }
    }
  }
}

module.exports = AssetController;
