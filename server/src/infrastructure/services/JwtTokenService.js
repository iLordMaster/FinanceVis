const jwt = require('jsonwebtoken');
const TokenService = require('../../application/interfaces/TokenService');

class JwtTokenService extends TokenService {
  constructor(secret) {
    super();
    this.secret = secret;
  }

  generateToken(payload) {
    return jwt.sign(payload, this.secret, { expiresIn: '1h' });
  }

  verifyToken(token) {
    return jwt.verify(token, this.secret);
  }
}

module.exports = JwtTokenService;
