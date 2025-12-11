class TransactionController {
  constructor(
    createTransaction,
    getTransactions,
    getTransactionSummary,
    deleteTransaction
  ) {
    this.createTransaction = createTransaction;
    this.getTransactions = getTransactions;
    this.getTransactionSummary = getTransactionSummary;
    this.deleteTransaction = deleteTransaction;
  }

  async create(req, res) {
    try {
      const transactionData = {
        userId: req.user.id,
        ...req.body,
      };
      const result = await this.createTransaction.execute(transactionData);
      res.status(201).json({
        message: "Transaction created successfully",
        transaction: result,
      });
    } catch (err) {
      if (err.code === "NO_ACCOUNTS") {
        res.status(400).json({
          message: err.message,
          code: "NO_ACCOUNTS",
          requiresAccountCreation: true,
        });
      } else if (
        err.message.includes("required") ||
        err.message.includes("must be")
      ) {
        res.status(400).json({ message: err.message });
      } else {
        console.error(err);
        res
          .status(500)
          .json({ message: "Error creating transaction", error: err.message });
      }
    }
  }

  async getAll(req, res) {
    try {
      const filters = req.query;
      const transactions = await this.getTransactions.execute(
        req.user.id,
        filters
      );
      res.json({
        count: transactions.length,
        transactions,
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "Error fetching transactions", error: err.message });
    }
  }

  async getSummary(req, res) {
    try {
      const filters = req.query;
      const summary = await this.getTransactionSummary.execute(
        req.user.id,
        filters
      );
      res.json(summary);
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "Error fetching summary", error: err.message });
    }
  }

  async delete(req, res) {
    try {
      await this.deleteTransaction.execute(req.params.id, req.user.id);
      res.json({
        message: "Transaction deleted successfully",
        transactionId: req.params.id,
      });
    } catch (err) {
      if (err.message === "Transaction not found") {
        res.status(404).json({ message: err.message });
      } else if (err.message === "Unauthorized") {
        res.status(403).json({ message: err.message });
      } else {
        console.error(err);
        res
          .status(500)
          .json({ message: "Error deleting transaction", error: err.message });
      }
    }
  }
}

module.exports = TransactionController;
