class Asset {
  constructor({ id, userId, name, value, color, createdAt }) {
    this.id = id;
    this.userId = userId;
    this.name = name;
    this.value = value;
    this.color = color;
    this.createdAt = createdAt || new Date();
  }
}

module.exports = Asset;
