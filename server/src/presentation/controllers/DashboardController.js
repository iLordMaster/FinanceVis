class DashboardController {
  constructor(dashboardService) {
    this.dashboardService = dashboardService;
  }

  async getTotals(req, res) {
    try {
      const accountId = req.query.accountId || null;
      const totals = await this.dashboardService.getTotals(
        req.user.id,
        accountId
      );
      res.json(totals);
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "Error fetching totals", error: err.message });
    }
  }

  async getMonthlyIncomeVsExpenses(req, res) {
    try {
      const year = parseInt(req.query.year) || new Date().getFullYear();
      const accountId = req.query.accountId || null;
      const stats = await this.dashboardService.getMonthlyIncomeVsExpenses(
        req.user.id,
        year,
        accountId
      );
      res.json(stats);
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "Error fetching monthly stats", error: err.message });
    }
  }

  async getTopCategories(req, res) {
    try {
      const type = req.query.type || "EXPENSE";
      const startDate = req.query.startDate
        ? new Date(req.query.startDate)
        : null;
      const endDate = req.query.endDate ? new Date(req.query.endDate) : null;
      const accountId = req.query.accountId || null;

      const categories = await this.dashboardService.getTopCategories(
        req.user.id,
        type,
        startDate,
        endDate,
        accountId
      );
      res.json(categories);
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "Error fetching top categories", error: err.message });
    }
  }

  async getRecentActivity(req, res) {
    try {
      const accountId = req.query.accountId || null;
      const activity = await this.dashboardService.getRecentActivity(
        req.user.id,
        accountId
      );
      res.json(activity);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "Error fetching recent activity",
        error: err.message,
      });
    }
  }

  async getAccountSummary(req, res) {
    try {
      const summary = await this.dashboardService.getAccountSummary(
        req.user.id
      );
      res.json(summary);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: `Error fetching account summary: ${err.message}`,
        error: err.message,
      });
    }
  }

  async getBudgetSummary(req, res) {
    try {
      const accountId = req.query.accountId || null;
      const summary = await this.dashboardService.getBudgetSummary(
        req.user.id,
        accountId
      );
      res.json(summary);
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "Error fetching budget summary", error: err.message });
    }
  }

  async getAssetSummary(req, res) {
    try {
      const summary = await this.dashboardService.getAssetSummary(req.user.id);
      res.json(summary);
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "Error fetching asset summary", error: err.message });
    }
  }

  async getMonthlyStatsForSpecificMonth(req, res) {
    try {
      const year = parseInt(req.query.year) || new Date().getFullYear();
      const month = parseInt(req.query.month) || new Date().getMonth() + 1;
      const accountId = req.query.accountId || null;
      const stats = await this.dashboardService.getMonthlyStatsForSpecificMonth(
        req.user.id,
        year,
        month,
        accountId
      );
      res.json(stats);
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "Error fetching monthly stats", error: err.message });
    }
  }

  async getAllMonthlyStats(req, res) {
    try {
      const accountId = req.query.accountId || null;
      const stats = await this.dashboardService.getAllMonthlyStats(
        req.user.id,
        accountId
      );
      res.json(stats);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "Error fetching all monthly stats",
        error: err.message,
      });
    }
  }
}

module.exports = DashboardController;
