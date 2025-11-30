const mongoose = require('mongoose');
// const request = require('supertest'); // Removed
const express = require('express');
const app = require('./server'); // I need to export app from server.js

// Since I didn't export app from server.js, I will modify server.js to export it or just run a standalone script that hits the running server.
// But the server is not running yet.
// I will create a script that starts the server, runs tests, and stops it.

const { spawn } = require('child_process');
const http = require('http');

const PORT = 5001; // Use a different port for testing

async function runTests() {
  console.log('Starting server for verification...');
  const serverProcess = spawn('node', ['server.js'], {
    cwd: __dirname,
    env: { ...process.env, PORT: PORT, MONGO_URI: process.env.MONGO_URI },
    stdio: 'inherit'
  });

  // Wait for server to start
  await new Promise(resolve => setTimeout(resolve, 5000));

  try {
    console.log('Testing Register...');
    const registerRes = await fetch(`http://localhost:${PORT}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'password123'
      })
    });
    const registerData = await registerRes.json();
    console.log('Register Response:', registerRes.status, registerData);

    if (registerRes.status !== 200) throw new Error('Register failed');

    const token = registerData.token;

    console.log('Testing Login...');
    const loginRes = await fetch(`http://localhost:${PORT}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: registerData.user.email,
        password: 'password123'
      })
    });
    const loginData = await loginRes.json();
    console.log('Login Response:', loginRes.status, loginData);

    if (loginRes.status !== 200) throw new Error('Login failed');

    console.log('Testing Get Profile (via Users route which uses authMiddleware)...');
    // Note: I haven't refactored the 'users' route to a new controller, but it uses the new User model now.
    // Let's assume there is a route /api/users/profile or similar.
    // Looking at users.js, there isn't a "get profile" route explicitly, but auth.js returned the user.
    // Let's try to hit a protected route, e.g. /api/transactions
    
    const transactionsRes = await fetch(`http://localhost:${PORT}/api/transactions`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const transactionsData = await transactionsRes.json();
    console.log('Transactions Response:', transactionsRes.status, transactionsData);

    if (transactionsRes.status !== 200) throw new Error('Get Transactions failed');

    console.log('Verification Successful!');
  } catch (err) {
    console.error('Verification Failed:', err);
  } finally {
    serverProcess.kill();
  }
}

runTests();
