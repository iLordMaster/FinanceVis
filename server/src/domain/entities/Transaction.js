class Transaction {
  constructor({ id, userId, amount, date, description, accountId, categoryId, type }) {
    this.id = id;
    this.userId = userId;
    this.amount = amount;
    this.date = date || new Date();
    this.description = description;
    this.accountId = accountId;
    this.categoryId = categoryId;
    this.type = type; // 'INCOME' or 'EXPENSE'
  }
}

module.exports = Transaction;
