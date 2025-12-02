require('dotenv').config();
const axios = require('axios');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5001';

// User credentials
const EMAIL = 'ayoubbenhajhassen@gmail.com';
const PASSWORD = 'Ha963214785';

// Category names (we'll fetch actual IDs after login)
const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Gift', 'Others'];
const EXPENSE_CATEGORIES = ['Housing', 'Food', 'Transportation', 'Entertainment', 'Healthcare', 'Shopping', 'Others'];

// Helper to generate random amount
const randomAmount = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper to generate random date in a specific month
const randomDateInMonth = (year, month) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const day = randomAmount(1, daysInMonth);
  return new Date(year, month, day);
};

async function login() {
  try {
    console.log('Logging in...');
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      email: EMAIL,
      password: PASSWORD
    });

    console.log(response.data);
    
    console.log('Login successful!');
    return response.data.token;
  } catch (error) {
    console.error('Login failed:',error, error.response?.data || error.message);
    throw error;
  }
}

async function getCategories(token) {
  try {
    console.log('Fetching categories...');
    const response = await axios.get(`${API_BASE_URL}/api/categories`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const categories = response.data.categories || response.data;
    console.log(`Found ${categories.length} categories`);
    
    return {
      income: categories.filter(c => c.type === 'INCOME'),
      expense: categories.filter(c => c.type === 'EXPENSE')
    };
  } catch (error) {
    console.error('Failed to fetch categories:', error.response?.data || error.message);
    throw error;
  }
}

async function getOrCreateAccounts(token) {
  try {
    console.log('Fetching accounts...');
    const response = await axios.get(`${API_BASE_URL}/api/accounts`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    let accounts = response.data.accounts || response.data;
    
    if (accounts.length === 0) {
      console.log('No accounts found. Creating default accounts...');
      
      // Create default accounts
      const defaultAccounts = [
        { name: 'Main Bank Account', type: 'BANK', balance: 5000 },
        { name: 'Cash Wallet', type: 'CASH', balance: 500 },
        { name: 'Savings Account', type: 'SAVINGS', balance: 10000 }
      ];
      
      accounts = [];
      for (const accountData of defaultAccounts) {
        const createResponse = await axios.post(`${API_BASE_URL}/api/accounts`, accountData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        accounts.push(createResponse.data.account || createResponse.data);
        console.log(`  Created account: ${accountData.name}`);
      }
    }
    
    console.log(`Using ${accounts.length} accounts for transactions`);
    return accounts;
  } catch (error) {
    console.error('Failed to fetch/create accounts:', error.response?.data || error.message);
    throw error;
  }
}

async function createTransaction(token, transactionData) {
  try {
    await axios.post(`${API_BASE_URL}/api/transactions`, transactionData, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (error) {
    console.error('Failed to create transaction:', error.response?.data || error.message);
  }
}

async function seedTransactions() {
  try {
    // Login
    const token = await login();
    
    // Get categories
    const { income, expense } = await getCategories(token);
    
    if (income.length === 0 || expense.length === 0) {
      console.error('No categories found. Please run seed_categories.js first.');
      return;
    }
    
    // Get or create accounts
    const accounts = await getOrCreateAccounts(token);
    
    if (accounts.length === 0) {
      console.error('No accounts available. Cannot create transactions.');
      return;
    }
    
    console.log(`\nSeeding transactions for the year 2025...`);
    
    const year = 2025;
    let transactionCount = 0;
    
    // For each month of the year
    for (let month = 0; month < 12; month++) {
      const monthName = new Date(year, month, 1).toLocaleString('default', { month: 'long' });
      console.log(`\nProcessing ${monthName} ${year}...`);
      
      // Create 2-4 income transactions per month
      const incomeCount = randomAmount(2, 4);
      for (let i = 0; i < incomeCount; i++) {
        const category = income[randomAmount(0, income.length - 1)];
        const account = accounts[randomAmount(0, accounts.length - 1)];
        const amount = category.name === 'Salary' 
          ? randomAmount(3000, 5000) 
          : randomAmount(100, 1500);
        
        await createTransaction(token, {
          accountId: account.id,
          categoryId: category.id,
          type: 'INCOME',
          amount,
          date: randomDateInMonth(year, month).toISOString(),
          description: `${category.name} - ${monthName}`
        });
        
        transactionCount++;
      }
      
      // Create 5-10 expense transactions per month
      const expenseCount = randomAmount(5, 10);
      for (let i = 0; i < expenseCount; i++) {
        const category = expense[randomAmount(0, expense.length - 1)];
        const account = accounts[randomAmount(0, accounts.length - 1)];
        const amount = category.name === 'Housing' 
          ? randomAmount(800, 1500) 
          : randomAmount(20, 500);
        
        await createTransaction(token, {
          accountId: account.id,
          categoryId: category.id,
          type: 'EXPENSE',
          amount,
          date: randomDateInMonth(year, month).toISOString(),
          description: `${category.name} - ${monthName}`
        });
        
        transactionCount++;
      }
      
      console.log(`  Created ${incomeCount} income + ${expenseCount} expense transactions`);
    }
    
    console.log(`\n✅ Successfully created ${transactionCount} transactions for ${year}!`);
    
  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
  }
}

// Run the script
seedTransactions();
