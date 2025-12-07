class RecurringTransaction {
  constructor({
    id,
    userId,
    accountId,
    categoryId,
    name,
    amount,
    type,
    frequency,
    dayOfMonth,
    startDate,
    endDate,
    lastExecuted,
    isActive,
    createdAt,
  }) {
    this.id = id;
    this.userId = userId;
    this.accountId = accountId;
    this.categoryId = categoryId;
    this.name = name;
    this.amount = amount;
    this.type = type;
    this.frequency = frequency || "MONTHLY";
    this.dayOfMonth = dayOfMonth;
    this.startDate = startDate;
    this.endDate = endDate || null;
    this.lastExecuted = lastExecuted || null;
    this.isActive = isActive !== undefined ? isActive : true;
    this.createdAt = createdAt || new Date();
  }
}

module.exports = RecurringTransaction;
