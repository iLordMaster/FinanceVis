class CategoryController {
  constructor(createCategory, getCategories, updateCategory, deleteCategory) {
    this.createCategory = createCategory;
    this.getCategories = getCategories;
    this.updateCategory = updateCategory;
    this.deleteCategory = deleteCategory;
  }

  async create(req, res) {
    res.status(403).json({ message: "Category creation is disabled for users." });
  }

  async getAll(req, res) {
    try {
      const filters = req.query;
      // Use findAll instead of getCategories (which might still be named getCategories in use case but implementation changed)
      // Assuming getCategories use case calls repository.findAll or findByUserId which now calls findAll
      const categories = await this.getCategories.execute(req.user.id, filters);
      res.json({
        count: categories.length,
        categories,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error fetching categories', error: err.message });
    }
  }

  async update(req, res) {
    res.status(403).json({ message: "Category update is disabled for users." });
  }

  async delete(req, res) {
    res.status(403).json({ message: "Category deletion is disabled for users." });
  }
}

module.exports = CategoryController;
