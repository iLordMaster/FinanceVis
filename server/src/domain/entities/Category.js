class Category {
  constructor({ id, userId, name, type, icon, color }) {
    this.id = id;
    this.userId = userId;
    this.name = name;
    this.type = type; // 'INCOME' or 'EXPENSE'
    this.icon = icon;
    this.color = color;
  }
}

module.exports = Category;
