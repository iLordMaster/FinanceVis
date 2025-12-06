import Api from "./api";

export class AssetApi extends Api {
  static api_url = Api.api_url + '/assets';

  // Create new asset
  static async createAsset(assetData) {
    return this.request(this.api_url, {
      method: "POST",
      body: JSON.stringify(assetData),
    });
  }

  // Get all assets
  static async getAssets() {
    return this.request(this.api_url, {
      method: "GET",
    });
  }

  // Get single asset
  static async getAsset(id) {
    return this.request(`${this.api_url}/${id}`, {
      method: "GET",
    });
  }

  // Update asset
  static async updateAsset(id, assetData) {
    return this.request(`${this.api_url}/${id}`, {
      method: "PUT",
      body: JSON.stringify(assetData),
    });
  }

  // Delete asset
  static async deleteAsset(id) {
    return this.request(`${this.api_url}/${id}`, {
      method: "DELETE",
    });
  }
}
