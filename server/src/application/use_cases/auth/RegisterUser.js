const User = require('../../../domain/entities/User');
const Category = require('../../../domain/entities/Category');

class RegisterUser {
  constructor(userRepository, categoryRepository, authService, tokenService) {
    this.userRepository = userRepository;
    this.categoryRepository = categoryRepository;
    this.authService = authService;
    this.tokenService = tokenService;
  }

  async execute({ name, email, password }) {
    // 1. Validate input (basic validation, more complex can be in entity or validator)
    if (!name || !email || !password) {
      throw new Error('All fields are required');
    }

    // 2. Check if user exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // 3. Hash password
    const hashedPassword = await this.authService.hashPassword(password);

    // 4. Create user
    const newUser = new User({
      name,
      email,
      passwordHash: hashedPassword,
    });
    const createdUser = await this.userRepository.create(newUser);

    // 5. Create default categories
    const defaultCategories = this._getDefaultCategories(createdUser.id);
    await this.categoryRepository.createMany(defaultCategories);

    // 6. Generate token
    const token = this.tokenService.generateToken({ id: createdUser.id });

    return { user: createdUser, token };
  }

  _getDefaultCategories(userId) {
    return [
      // Income
      new Category({ userId, name: "Salary", type: "INCOME", icon: "💼", color: "#10b981" }),
      new Category({ userId, name: "Freelance", type: "INCOME", icon: "💻", color: "#3b82f6" }),
      new Category({ userId, name: "Gift", type: "INCOME", icon: "🎁", color: "#ec4899" }),
      new Category({ userId, name: "Others", type: "INCOME", icon: "💰", color: "#8b5cf6" }),
      // Expense
      new Category({ userId, name: "Housing", type: "EXPENSE", icon: "🏠", color: "#ef4444" }),
      new Category({ userId, name: "Transportation", type: "EXPENSE", icon: "🚗", color: "#f59e0b" }),
      new Category({ userId, name: "Food & Dining", type: "EXPENSE", icon: "🍔", color: "#84cc16" }),
      new Category({ userId, name: "Healthcare", type: "EXPENSE", icon: "⚕️", color: "#06b6d4" }),
      new Category({ userId, name: "Entertainment", type: "EXPENSE", icon: "🎮", color: "#8b5cf6" }),
      new Category({ userId, name: "Shopping", type: "EXPENSE", icon: "🛍️", color: "#ec4899" }),
      new Category({ userId, name: "Bills & Utilities", type: "EXPENSE", icon: "📄", color: "#6366f1" }),
      new Category({ userId, name: "Education", type: "EXPENSE", icon: "📚", color: "#14b8a6" }),
      new Category({ userId, name: "Personal Care", type: "EXPENSE", icon: "💅", color: "#a855f7" }),
      new Category({ userId, name: "Others", type: "EXPENSE", icon: "📦", color: "#64748b" }),
    ];
  }
}

module.exports = RegisterUser;
