class UpdateUserProfile {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(id, updates) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    if (updates.email) {
      const existingUser = await this.userRepository.findByEmail(updates.email);
      if (existingUser && existingUser.id !== id) {
        throw new Error('Email already in use');
      }
    }

    return await this.userRepository.update(id, updates);
  }
}

module.exports = UpdateUserProfile;
