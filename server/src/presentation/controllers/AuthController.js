const logger = require("../../../config/logger");

class AuthController {
  constructor(registerUserUseCase, loginUserUseCase) {
    this.registerUserUseCase = registerUserUseCase;
    this.loginUserUseCase = loginUserUseCase;
  }

  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      const result = await this.registerUserUseCase.execute({
        name,
        email,
        password,
      });
      logger.info("User registered successfully", {
        userId: result.user.id,
        email: result.user.email,
      });
      res.json(result);
    } catch (err) {
      // Handle validation errors
      if (
        err.message === "User with this email already exists" ||
        err.message === "All fields are required"
      ) {
        return res.status(400).json({ message: err.message });
      }

      // Handle MongoDB duplicate key errors (E11000)
      if (err.code === 11000 || err.errorResponse?.code === 11000) {
        const field = Object.keys(
          err.keyPattern || err.errorResponse?.keyPattern || {}
        )[0];
        const value =
          err.keyValue?.[field] || err.errorResponse?.keyValue?.[field];

        // Provide user-friendly error messages
        if (field === "email") {
          return res.status(400).json({
            message: "An account with this email already exists",
            field: "email",
          });
        } else if (field === "username") {
          return res.status(400).json({
            message: "This username is already taken",
            field: "username",
          });
        } else {
          return res.status(400).json({
            message: `A user with this ${field} already exists`,
            field,
          });
        }
      }

      // Handle Mongoose validation errors
      if (err.name === "ValidationError") {
        const errors = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({
          message: "Validation failed",
          errors,
        });
      }

      // Log unexpected errors and return generic message
      console.error("Registration error:", err);
      logger.error("Registration error", { error: err.message });
      res.status(500).json({
        message:
          "An error occurred during registration. Please try again later.",
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await this.loginUserUseCase.execute({ email, password });
      logger.info("User logged in successfully", {
        userId: result.user.id,
        email: result.user.email,
      });
      res.json(result);
    } catch (err) {
      // Handle authentication errors
      if (
        err.message === "Invalid email or password" ||
        err.message === "Email and password are required"
      ) {
        return res.status(401).json({ message: err.message });
      }

      // Log unexpected errors and return generic message
      console.error("Login error:", err);
      logger.error("Login error", { error: err.message });
      res.status(500).json({
        message: "An error occurred during login. Please try again later.",
      });
    }
  }

  async getMe(req, res) {
    try {
      // req.user is set by authMiddleware after verifying the JWT token
      res.json({ id: req.user.id });
    } catch (err) {
      console.error("Get me error:", err);
      res.status(500).json({
        message: "An error occurred while fetching user information.",
      });
    }
  }
}

module.exports = AuthController;
