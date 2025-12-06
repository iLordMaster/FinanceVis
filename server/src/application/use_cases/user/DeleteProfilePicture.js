class DeleteProfilePicture {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    user.profilePicture = null;
    await this.userRepository.update(user.id, { profilePicture: null });
    return user;
  }
}

module.exports = DeleteProfilePicture;
