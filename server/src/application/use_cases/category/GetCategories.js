class GetCategories {
  constructor(categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async execute(userId, filters) {
    return await this.categoryRepository.findByUserId(userId, filters);
  }
}

module.exports = GetCategories;
