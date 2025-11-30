class DeleteCategory {
  constructor(categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async execute(id, userId) {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new Error('Category not found');
    }
    if (category.userId !== userId) {
      throw new Error('Unauthorized');
    }
    return await this.categoryRepository.deleteById(id);
  }
}

module.exports = DeleteCategory;
