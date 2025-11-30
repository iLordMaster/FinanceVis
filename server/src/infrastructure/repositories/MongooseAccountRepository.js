const AccountRepository = require('../../domain/repositories/AccountRepository');
const AccountModel = require('../database/models/AccountModel');
const Account = require('../../domain/entities/Account');

class MongooseAccountRepository extends AccountRepository {
  async create(account) {
    const newAccount = new AccountModel({
      userId: account.userId,
      name: account.name,
      balance: account.balance,
      currency: account.currency,
    });
    const savedAccount = await newAccount.save();
    return this._toEntity(savedAccount);
  }

  async findByUserId(userId) {
    const accounts = await AccountModel.find({ userId }).sort({ createdAt: -1 });
    return accounts.map(this._toEntity);
  }

  async findById(id) {
    const account = await AccountModel.findById(id);
    if (!account) return null;
    return this._toEntity(account);
  }

  async update(id, updates) {
    const account = await AccountModel.findByIdAndUpdate(id, updates, { new: true });
    if (!account) return null;
    return this._toEntity(account);
  }

  async deleteById(id) {
    const account = await AccountModel.findByIdAndDelete(id);
    return !!account;
  }

  async updateBalance(id, amount) {
    const account = await AccountModel.findByIdAndUpdate(
      id,
      { $inc: { balance: amount } },
      { new: true }
    );
    return this._toEntity(account);
  }

  _toEntity(mongoAccount) {
    return new Account({
      id: mongoAccount._id.toString(),
      userId: mongoAccount.userId.toString(),
      name: mongoAccount.name,
      balance: mongoAccount.balance,
      currency: mongoAccount.currency,
      createdAt: mongoAccount.createdAt,
    });
  }
}

module.exports = MongooseAccountRepository;
