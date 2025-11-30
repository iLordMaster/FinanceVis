class Budget {
  constructor({ id, userId, categoryId, amount, month, year, createdAt }) {
    this.id = id;
    this.userId = userId;
    this.categoryId = categoryId;
    this.amount = amount;
    this.month = month;
    this.year = year;
    this.createdAt = createdAt || new Date();
  }
}

module.exports = Budget;
