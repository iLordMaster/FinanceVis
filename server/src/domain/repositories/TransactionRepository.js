class TransactionRepository {
  async create(transaction) {
    throw new Error('Method not implemented');
  }

  async findByUserId(userId) {
    throw new Error('Method not implemented');
  }

  async deleteById(id) {
    throw new Error('Method not implemented');
  }

  async getMonthlyStats(userId, year) {
    throw new Error('Method not implemented');
  }

  async getCategoryStats(userId, startDate, endDate) {
    throw new Error('Method not implemented');
  }

  async getMonthlyStatsForSpecificMonth(userId, year, month) {
    throw new Error('Method not implemented');
  }

  async getAllMonthlyStats(userId) {
    throw new Error('Method not implemented');
  }
}

module.exports = TransactionRepository;
