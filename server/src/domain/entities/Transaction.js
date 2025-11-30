class Transaction {
  constructor({ id, userId, amount, date, description, category, type }) {
    this.id = id;
    this.userId = userId;
    this.amount = amount;
    this.date = date || new Date();
    this.description = description;
    this.category = category;
    this.type = type; // 'INCOME' or 'EXPENSE'
  }
}

module.exports = Transaction;
