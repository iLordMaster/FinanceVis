const logger = require("../../../config/logger");

class BudgetController {
  constructor(createBudget, getBudgets, updateBudget, deleteBudget) {
    this.createBudget = createBudget;
    this.getBudgets = getBudgets;
    this.updateBudget = updateBudget;
    this.deleteBudget = deleteBudget;
  }

  async create(req, res) {
    try {
      const budgetData = {
        userId: req.user.id,
        ...req.body,
      };
      const result = await this.createBudget.execute(budgetData);
      logger.info("Budget created successfully", {
        budgetId: result.id,
        userId: req.user.id,
      });
      res.status(201).json({
        message: "Budget created successfully",
        budget: result,
      });
    } catch (err) {
      if (
        err.message.includes("required") ||
        err.message.includes("must be") ||
        err.message.includes("exists")
      ) {
        res.status(400).json({ message: err.message });
      } else {
        console.error(err);
        logger.error("Error creating budget", {
          error: err.message,
          userId: req.user.id,
        });
        res
          .status(500)
          .json({ message: "Error creating budget", error: err.message });
      }
    }
  }

  async getAll(req, res) {
    try {
      const filters = req.query;
      const budgets = await this.getBudgets.execute(req.user.id, filters);
      res.json({
        count: budgets.length,
        budgets,
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "Error fetching budgets", error: err.message });
    }
  }

  async update(req, res) {
    try {
      const result = await this.updateBudget.execute(
        req.params.id,
        req.user.id,
        req.body
      );
      logger.info("Budget updated successfully", {
        budgetId: result.id,
        userId: req.user.id,
      });
      res.json({
        message: "Budget updated successfully",
        budget: result,
      });
    } catch (err) {
      if (err.message === "Budget not found") {
        res.status(404).json({ message: err.message });
      } else if (err.message === "Unauthorized") {
        res.status(403).json({ message: err.message });
      } else if (err.message.includes("must be")) {
        res.status(400).json({ message: err.message });
      } else {
        console.error(err);
        logger.error("Error updating budget", {
          error: err.message,
          userId: req.user.id,
          budgetId: req.params.id,
        });
        res
          .status(500)
          .json({ message: "Error updating budget", error: err.message });
      }
    }
  }

  async delete(req, res) {
    try {
      await this.deleteBudget.execute(req.params.id, req.user.id);
      res.json({
        message: "Budget deleted successfully",
        budgetId: req.params.id,
      });
    } catch (err) {
      if (err.message === "Budget not found") {
        res.status(404).json({ message: err.message });
      } else if (err.message === "Unauthorized") {
        res.status(403).json({ message: err.message });
      } else {
        console.error(err);
        res
          .status(500)
          .json({ message: "Error deleting budget", error: err.message });
      }
    }
  }
}

module.exports = BudgetController;
