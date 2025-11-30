class UpdateCategory {
  constructor(categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async execute(id, userId, updates) {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new Error('Category not found');
    }
    if (category.userId !== userId) {
      throw new Error('Unauthorized');
    }

    if (updates.type && !['INCOME', 'EXPENSE'].includes(updates.type)) {
      throw new Error('type must be either INCOME or EXPENSE');
    }

    return await this.categoryRepository.update(id, updates);
  }
}

module.exports = UpdateCategory;
