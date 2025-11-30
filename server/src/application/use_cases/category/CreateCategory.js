const Category = require('../../../domain/entities/Category');

class CreateCategory {
  constructor(categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async execute(categoryData) {
    const { userId, name, type, icon, color } = categoryData;

    if (!name || !type) {
      throw new Error('name and type are required');
    }

    if (!['INCOME', 'EXPENSE'].includes(type)) {
      throw new Error('type must be either INCOME or EXPENSE');
    }

    const category = new Category({
      userId,
      name,
      type,
      icon,
      color,
    });

    return await this.categoryRepository.create(category);
  }
}

module.exports = CreateCategory;
