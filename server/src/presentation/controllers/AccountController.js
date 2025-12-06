class AccountController {
  constructor(createAccount, getAccounts, updateAccount, deleteAccount) {
    this.createAccount = createAccount;
    this.getAccounts = getAccounts;
    this.updateAccount = updateAccount;
    this.deleteAccount = deleteAccount;
  }

  async create(req, res) {
    try {
      const accountData = {
        userId: req.user.id,
        ...req.body,
      };
      const result = await this.createAccount.execute(accountData);
      res.status(201).json({
        message: "Account created successfully",
        account: result,
      });
    } catch (err) {
      if (err.message.includes("required")) {
        res.status(400).json({ message: err.message });
      } else {
        console.error(err);
        res
          .status(500)
          .json({ message: "Error creating account", error: err.message });
      }
    }
  }

  async getAll(req, res) {
    try {
      const { accounts, totalBalance } = await this.getAccounts.execute(
        req.user.id
      );
      res.json({
        count: accounts.length,
        totalBalance,
        accounts,
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "Error fetching accounts", error: err.message });
    }
  }

  async update(req, res) {
    try {
      const result = await this.updateAccount.execute(
        req.params.id,
        req.user.id,
        req.body
      );
      res.json({
        message: "Account updated successfully",
        account: result,
      });
    } catch (err) {
      if (err.message === "Account not found") {
        res.status(404).json({ message: err.message });
      } else if (err.message === "Unauthorized") {
        res.status(403).json({ message: err.message });
      } else {
        console.error(err);
        res
          .status(500)
          .json({
            message: `Error updating account: ${err.message}`,
            error: err.message,
          });
      }
    }
  }

  async delete(req, res) {
    try {
      await this.deleteAccount.execute(req.params.id, req.user.id);
      res.json({
        message: "Account deleted successfully",
        accountId: req.params.id,
      });
    } catch (err) {
      if (err.message === "Account not found") {
        res.status(404).json({ message: err.message });
      } else if (err.message === "Unauthorized") {
        res.status(403).json({ message: err.message });
      } else {
        console.error(err);
        res
          .status(500)
          .json({ message: "Error deleting account", error: err.message });
      }
    }
  }
}

module.exports = AccountController;
