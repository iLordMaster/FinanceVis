const http = require('http');

const PORT = 5001;
const BASE_URL = `http://localhost:${PORT}/api`;

function request(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: PORT,
      path: `/api${path}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject({ statusCode: res.statusCode, body: parsed });
          }
        } catch (e) {
          resolve(body); // Return raw body if not JSON
        }
      });
    });

    req.on('error', (e) => reject(e));

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runVerification() {
  try {
    console.log('Starting verification...');

    // 1. Register/Login
    const email = `test${Date.now()}@example.com`;
    const password = 'password123';
    console.log(`Registering user: ${email}`);
    
    let user;
    let token;

    try {
      const authRes = await request('POST', '/auth/register', {
        name: `user${Date.now()}`,
        email,
        password
      });
      user = authRes.user;
      token = authRes.token;
      console.log('Registration successful');
    } catch (e) {
      console.error('Registration failed', e);
      return;
    }

    // 2. Create Account
    console.log('Creating account...');
    const account = await request('POST', '/accounts', {
      name: 'Main Bank',
      balance: 1000,
      currency: 'USD'
    }, token);
    console.log('Account created:', account);
    console.log('Initial Balance:', account.account.balance);

    // 3. Fetch Global Categories
    console.log('Fetching global categories...');
    const categoriesResponse = await request('GET', '/categories', null, token);
    console.log(`Found ${categoriesResponse.count} global categories`);
    
    // Find an expense category to use
    const expenseCategory = categoriesResponse.categories.find(cat => cat.type === 'EXPENSE');
    if (!expenseCategory) {
      console.error('No expense categories found!');
      return;
    }
    console.log('Using category:', expenseCategory.name, '(', expenseCategory.id, ')');

    console.log('Account id:', account.account.id);
    console.log('Category id:', expenseCategory.id);

    // 4. Create Transaction
    console.log('Creating transaction...');
    const transaction = await request('POST', '/transactions', {
      accountId: account.account.id,
      categoryId: expenseCategory.id,
      type: 'EXPENSE',
      amount: 50,
      date: new Date().toISOString(),
      description: 'Weekly groceries'
    }, token);
    console.log('Transaction created', transaction);

    // Check balance after transaction
    const updatedAccount = await request('GET', `/accounts`, null, token);
    console.log('Updated Account', updatedAccount.accounts[0]);
    console.log('Updated Account Balance:', updatedAccount.accounts[0].balance);

    // 5. Create Asset
    console.log('\nCreating asset...');
    const asset = await request('POST', '/assets', {
      name: 'Investment Portfolio',
      value: 5000,
      color: '#4CAF50'
    }, token);
    console.log('Asset created:', asset);

    // 6. Create Budget
    console.log('\nCreating budget...');
    const budget = await request('POST', '/budgets', {
      categoryId: expenseCategory.id,
      amount: 200,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear()
    }, token);
    console.log('Budget created:', budget);

    // 7. Verify Dashboard Endpoints
    console.log('\n--- Verifying Dashboard Endpoints ---');

    console.log('Fetching Totals...');
    const totals = await request('GET', '/dashboard/totals', null, token);
    console.log('Totals:', totals);

    console.log('Fetching Monthly Stats...');
    const monthly = await request('GET', '/dashboard/monthly-stats', null, token);
    console.log('Monthly Stats:', monthly);

    console.log('Fetching Top Categories...');
    const topCategories = await request('GET', '/dashboard/top-categories', null, token);
    console.log('Top Categories:', topCategories);

    console.log('Fetching Recent Activity...');
    const recent = await request('GET', '/dashboard/recent-activity', null, token);
    console.log('Recent Activity:', recent);

    console.log('Fetching Account Summary...');
    const accountSummary = await request('GET', '/dashboard/account-summary', null, token);
    console.log('Account Summary:', accountSummary);

    console.log('Fetching Budget Summary...');
    const budgetSummary = await request('GET', '/dashboard/budget-summary', null, token);
    console.log('Budget Summary:', budgetSummary);

    console.log('Fetching Asset Summary...');
    const assetSummary = await request('GET', '/dashboard/asset-summary', null, token);
    console.log('Asset Summary:', assetSummary);

    console.log('\nVerification Complete!');

  } catch (error) {
    console.error('Verification failed:', error);
  }
}

runVerification();
