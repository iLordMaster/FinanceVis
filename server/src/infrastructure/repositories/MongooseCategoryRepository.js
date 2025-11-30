const CategoryRepository = require('../../domain/repositories/CategoryRepository');
const CategoryModel = require('../database/models/CategoryModel');
const Category = require('../../domain/entities/Category');

class MongooseCategoryRepository extends CategoryRepository {
  async create(category) {
    const newCategory = new CategoryModel({
      name: category.name,
      type: category.type,
      icon: category.icon,
      color: category.color,
    });
    const savedCategory = await newCategory.save();
    return this._toEntity(savedCategory);
  }

  async createMany(categories) {
    const categoryDocs = categories.map(cat => ({
      name: cat.name,
      type: cat.type,
      icon: cat.icon,
      color: cat.color,
    }));
    const savedCategories = await CategoryModel.insertMany(categoryDocs);
    return savedCategories.map(cat => this._toEntity(cat));
  }

  async findByUserId(userId, filters = {}) {
    // Deprecated: Categories are now global, redirecting to findAll
    return this.findAll(filters);
  }

  async findAll(filters = {}) {
    const query = {};
    if (filters.type) query.type = filters.type;
    const categories = await CategoryModel.find(query).sort({ name: 1 });
    return categories.map(cat => this._toEntity(cat));
  }

  async findById(id) {
    const category = await CategoryModel.findById(id);
    if (!category) return null;
    return this._toEntity(category);
  }

  async update(id, updates) {
    const category = await CategoryModel.findByIdAndUpdate(id, updates, { new: true });
    if (!category) return null;
    return this._toEntity(category);
  }

  async deleteById(id) {
    const category = await CategoryModel.findByIdAndDelete(id);
    return !!category;
  }

  _toEntity(mongoCategory) {
    return new Category({
      id: mongoCategory._id.toString(),
      // userId: mongoCategory.userId.toString(), // Removed
      name: mongoCategory.name,
      type: mongoCategory.type,
      icon: mongoCategory.icon,
      color: mongoCategory.color,
    });
  }
}

module.exports = MongooseCategoryRepository;
