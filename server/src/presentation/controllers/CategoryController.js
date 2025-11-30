class CategoryController {
  constructor(createCategory, getCategories, updateCategory, deleteCategory) {
    this.createCategory = createCategory;
    this.getCategories = getCategories;
    this.updateCategory = updateCategory;
    this.deleteCategory = deleteCategory;
  }

  async create(req, res) {
    try {
      const categoryData = {
        userId: req.user.id,
        ...req.body
      };
      const result = await this.createCategory.execute(categoryData);
      res.status(201).json({
        message: "Category created successfully",
        category: result,
      });
    } catch (err) {
      if (err.message.includes('required') || err.message.includes('must be')) {
        res.status(400).json({ message: err.message });
      } else {
        console.error(err);
        res.status(500).json({ message: 'Error creating category', error: err.message });
      }
    }
  }

  async getAll(req, res) {
    try {
      const filters = req.query;
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
    try {
      const result = await this.updateCategory.execute(req.params.id, req.user.id, req.body);
      res.json({
        message: "Category updated successfully",
        category: result,
      });
    } catch (err) {
      if (err.message === 'Category not found') {
        res.status(404).json({ message: err.message });
      } else if (err.message === 'Unauthorized') {
        res.status(403).json({ message: err.message });
      } else if (err.message.includes('must be')) {
        res.status(400).json({ message: err.message });
      } else {
        console.error(err);
        res.status(500).json({ message: 'Error updating category', error: err.message });
      }
    }
  }

  async delete(req, res) {
    try {
      await this.deleteCategory.execute(req.params.id, req.user.id);
      res.json({
        message: "Category deleted successfully",
        categoryId: req.params.id,
      });
    } catch (err) {
      if (err.message === 'Category not found') {
        res.status(404).json({ message: err.message });
      } else if (err.message === 'Unauthorized') {
        res.status(403).json({ message: err.message });
      } else {
        console.error(err);
        res.status(500).json({ message: 'Error deleting category', error: err.message });
      }
    }
  }
}

module.exports = CategoryController;
