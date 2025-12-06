class Account {
  constructor({ id, userId, name, balance, currency, incomeGoal, createdAt }) {
    this.id = id;
    this.userId = userId;
    this.name = name;
    this.balance = balance || 0;
    this.currency = currency || "USD";
    this.createdAt = createdAt || new Date();
    this.incomeGoal = incomeGoal || 0;
  }
}

module.exports = Account;
