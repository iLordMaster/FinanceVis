const bcrypt = require('bcryptjs');
const AuthService = require('../../application/interfaces/AuthService');

class BcryptAuthService extends AuthService {
  async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  async comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }
}

module.exports = BcryptAuthService;
