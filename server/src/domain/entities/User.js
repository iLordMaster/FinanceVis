class User {
  constructor({ id, name, email, passwordHash, profilePicture, createdAt }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.passwordHash = passwordHash;
    this.profilePicture = profilePicture;
    this.createdAt = createdAt || new Date();
  }
}

module.exports = User;
