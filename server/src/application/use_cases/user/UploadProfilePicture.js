class UploadProfilePicture {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(id, filePath) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    // Note: Cloudinary logic is currently in the route/controller in the old code.
    // Ideally, we should have a StorageService interface.
    // For now, I will pass the filePath (which is the Cloudinary URL from multer-storage-cloudinary)
    // to the repository to update the user.
    
    return await this.userRepository.update(id, { profilePicture: filePath });
  }
}

module.exports = UploadProfilePicture;
