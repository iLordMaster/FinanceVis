class AuthController {
  constructor(registerUserUseCase, loginUserUseCase) {
    this.registerUserUseCase = registerUserUseCase;
    this.loginUserUseCase = loginUserUseCase;
  }

  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      const result = await this.registerUserUseCase.execute({ name, email, password });
      res.json(result);
    } catch (err) {
      if (err.message === 'User with this email already exists' || err.message === 'All fields are required') {
        res.status(400).json({ message: err.message });
      } else {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await this.loginUserUseCase.execute({ email, password });
      res.json(result);
    } catch (err) {
      if (err.message === 'Invalid email or password' || err.message === 'Email and password are required') {
        res.status(401).json({ message: err.message });
      } else {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  }
}

module.exports = AuthController;
