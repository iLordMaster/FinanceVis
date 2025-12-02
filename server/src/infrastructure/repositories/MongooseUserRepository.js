const UserRepository = require('../../domain/repositories/UserRepository');
const UserModel = require('../database/models/UserModel');
const User = require('../../domain/entities/User');

class MongooseUserRepository extends UserRepository {
  async create(user) {
    const newUser = new UserModel({
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      profilePicture: user.profilePicture,
    });
    const savedUser = await newUser.save();
    return this._toEntity(savedUser);
  }

  async findByEmail(email) {
    const user = await UserModel.findOne({ email });
    if (!user) return null;
    return this._toEntity(user);
  }

  async findById(id) {
    const user = await UserModel.findById(id);
    if (!user) return null;
    return this._toEntity(user);
  }

  async update(id, updates) {
    const user = await UserModel.findByIdAndUpdate(id, updates, { new: true });
    if (!user) return null;
    return this._toEntity(user);
  }

  _toEntity(mongoUser) {
    return new User({
      id: mongoUser._id.toString(),
      name: mongoUser.name,
      email: mongoUser.email,
      passwordHash: mongoUser.passwordHash,
      profilePicture: mongoUser.profilePicture,
      incomeGoal: mongoUser.incomeGoal,
      createdAt: mongoUser.createdAt,
    });
  }
}

module.exports = MongooseUserRepository;
