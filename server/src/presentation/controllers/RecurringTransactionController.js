class RecurringTransactionController {
  constructor(
    createRecurringTransaction,
    getRecurringTransactions,
    updateRecurringTransaction,
    deleteRecurringTransaction
  ) {
    this.createRecurringTransaction = createRecurringTransaction;
    this.getRecurringTransactions = getRecurringTransactions;
    this.updateRecurringTransaction = updateRecurringTransaction;
    this.deleteRecurringTransaction = deleteRecurringTransaction;
  }

  async create(req, res) {
    try {
      const data = {
        userId: req.user.id,
        ...req.body,
      };
      const result = await this.createRecurringTransaction.execute(data);
      res.status(201).json({
        message: "Recurring transaction created successfully",
        recurringTransaction: result,
      });
    } catch (err) {
      if (err.message.includes("required") || err.message.includes("must be")) {
        res.status(400).json({ message: err.message });
      } else {
        res.status(500).json({
          message: "Error creating recurring transaction",
          error: err.message,
        });
      }
    }
  }

  async getAll(req, res) {
    try {
      const recurringTransactions = await this.getRecurringTransactions.execute(
        req.user.id
      );
      res.json({
        count: recurringTransactions.length,
        recurringTransactions,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "Error fetching recurring transactions",
        error: err.message,
      });
    }
  }

  async update(req, res) {
    try {
      const result = await this.updateRecurringTransaction.execute(
        req.params.id,
        req.user.id,
        req.body
      );
      res.json({
        message: "Recurring transaction updated successfully",
        recurringTransaction: result,
      });
    } catch (err) {
      if (err.message === "Recurring transaction not found") {
        res.status(404).json({ message: err.message });
      } else if (err.message === "Unauthorized") {
        res.status(403).json({ message: err.message });
      } else if (err.message.includes("must be")) {
        res.status(400).json({ message: err.message });
      } else {
        console.error(err);
        res.status(500).json({
          message: "Error updating recurring transaction",
          error: err.message,
        });
      }
    }
  }

  async delete(req, res) {
    try {
      await this.deleteRecurringTransaction.execute(req.params.id, req.user.id);
      res.json({
        message: "Recurring transaction deleted successfully",
        id: req.params.id,
      });
    } catch (err) {
      if (err.message === "Recurring transaction not found") {
        res.status(404).json({ message: err.message });
      } else if (err.message === "Unauthorized") {
        res.status(403).json({ message: err.message });
      } else {
        console.error(err);
        res.status(500).json({
          message: "Error deleting recurring transaction",
          error: err.message,
        });
      }
    }
  }
}

module.exports = RecurringTransactionController;
