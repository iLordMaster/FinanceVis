# User API Documentation

## Overview
This API provides endpoints to manage users in MongoDB. The API includes validation, password hashing, and error handling.

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Create a `.env` file in the `server` directory with:
   ```
   MONGO_URI=your-mongodb-connection-string-here
   PORT=5000
   JWT_SECRET=your-secret-key-here
   ```

3. **Start the Server**
   ```bash
   npm start
   ```

## API Endpoints

### Add a New User
**POST** `/api/users/`

Creates a new user in the database.

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Success Response (201):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Missing required fields, invalid email, password too short, or user already exists
- `500` - Server error

**Validation Rules:**
- Username: Required, must be unique
- Email: Required, must be valid format, must be unique
- Password: Required, minimum 6 characters

**Example using cURL:**
```bash
curl -X POST http://localhost:5000/api/users/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

**Example using JavaScript (fetch):**
```javascript
fetch('http://localhost:5000/api/users/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'johndoe',
    email: 'john@example.com',
    password: 'securepassword123'
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

### Get All Users
**GET** `/api/users/`

Retrieves all users from the database (passwords are excluded).

**Success Response (200):**
```json
{
  "count": 2,
  "users": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "username": "johndoe",
      "email": "john@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get User by ID
**GET** `/api/users/:id`

Retrieves a specific user by their ID.

**Success Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "johndoe",
  "email": "john@example.com",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Response:**
- `404` - User not found
- `500` - Server error

## Security Features

- Passwords are hashed using bcrypt before storage
- Passwords are never returned in API responses
- Email and username uniqueness validation
- Input validation for all fields

## Notes

- The server runs on port 5000 by default (or the port specified in your `.env` file)
- Make sure your MongoDB connection string is correctly configured in the `.env` file
- The API uses CORS, so it can be called from frontend applications






