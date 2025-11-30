class AuthService {
  async hashPassword(password) {
    throw new Error('Method not implemented');
  }

  async comparePassword(password, hash) {
    throw new Error('Method not implemented');
  }
}

module.exports = AuthService;
