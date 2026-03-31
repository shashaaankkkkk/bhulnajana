# Mobile API Documentation (React Native)

Welcome! This documentation outlines the REST APIs available for integrating the React Native application with the backend. 

Base URL: `http://<your-server-ip>:3000` (Local) or `https://your-production-domain.com` (Production)

---

## 🔐 1. Authentication (Register & Login)

Get your Bearer Token by creating an account or logging in.

### Register Account
**POST** `/api/mobile/register`
- **Body** (JSON): 
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "securepassword123"
  }
  ```
- **Success Response (201 Created)**
  ```json
  {
    "token": "eyJhbG...",
    "user": {
      "id": "60d5ecb8b...",
      "email": "jane@example.com",
      "name": "Jane Doe"
    }
  }
  ```

### Login Account
**POST** `/api/mobile/login`
- **Body** (JSON): 
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword"
  }
  ```
- **Success Response (200 OK)**
  ```json
  {
    "token": "eyJhbG...",
    "user": {
      "id": "60d5ecb8b...",
      "email": "user@example.com",
      "name": "User Name"
    }
  }
  ```
- **Error Responses**: 
  - `400 Bad Request`: "Email and password are required"
  - `401 Unauthorized`: "Invalid credentials"

> **IMPORTANT:** For all subsequent requests listed below, you MUST include the token received from the Login API in the headers:
> `Authorization: Bearer <your_token_here>`

---

## ✅ 2. Todos & Focus API

All Todo endpoints require the `Authorization: Bearer <token>` header. The system now supports high-fidelity architectural goal tracking.

### Get All Todos
**GET** `/api/todos`
- **Description**: Fetches all todos for the authenticated user, sorted by newest first.
- **Response (200 OK)**
  ```json
  [
    {
      "_id": "abc1234",
      "title": "Build Binary Tree traversal",
      "description": "Implement DFS and BFS benchmarks",
      "status": "pending",
      "category": "dsa",  // 'task' | 'dsa'
      "problemLink": "https://leetcode.com/problems/...", // Optional for 'dsa'
      "deadline": "2026-04-01T10:00:00.000Z",
      "userId": "60d5ec...",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
  ```

### Create a Todo
**POST** `/api/todos`
- **Body** (JSON):
  ```json
  {
    "title": "New Goal",
    "description": "Engineering details",
    "status": "pending", 
    "category": "task",  // Default: 'task'
    "problemLink": "",   // Optional: URL for 'dsa' revision
    "deadline": "2026-04-01T10:00:00.000Z" // Optional
  }
  ```
- **Response (201 Created)**: Returns the newly created Todo object.

### Update a Todo
**PUT** `/api/todos/:id`
- **Params**: `id` - The `_id` of the Todo to update.
- **Body** (JSON): Provide only the fields you wish to change.
  ```json
  {
    "status": "completed",
    "category": "dsa"
  }
  ```
- **Response (200 OK)**: Returns the updated Todo object.

### Delete a Todo
**DELETE** `/api/todos/:id`
- **Params**: `id` - The `_id` of the Todo to delete.
- **Response (200 OK)**: `{ "message": "Todo deleted successfully" }`

---

## 📝 3. Blueprints API (Notes)

The system has evolved from simple notes into a **Digital Notebook for high-fidelity blueprints**. All endpoints require the `Authorization: Bearer <token>` header.

### Get All Blueprints
**GET** `/api/notes`
- **Description**: Fetches all architectural blueprints for the authenticated user.
- **Response (200 OK)**
  ```json
  [
    {
      "_id": "xyz987",
      "title": "PROJECT BLUEPRINT",
      "content": "# ARCHITECTURAL BENCHMARKS\n- [ ] Task 1\n```python\n# Run code benchmarks\n```",
      "userId": "60d5ec...",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
  ```

### Create a Blueprint
**POST** `/api/notes`
- **Body** (JSON):
  ```json
  {
    "title": "NEW BLUEPRINT",
    "content": "Start architecting here..."
  }
  ```
- **Response (201 Created)**: Returns the newly created Note object.

### Update a Blueprint
**PUT** `/api/notes/:id`
- **Params**: `id` - The `_id` of the Note to update.
- **Body** (JSON):
  ```json
  {
    "title": "UPDATED ARCHITECTURE",
    "content": "Updated technical benchmarks here..."
  }
  ```
- **Response (200 OK)**: Returns the updated Note object.

### Delete a Blueprint
**DELETE** `/api/notes/:id`
- **Params**: `id` - The `_id` of the Note to delete.
- **Response (200 OK)**: `{ "message": "Blueprint deleted successfully" }`

---

## 🔔 4. Notifications API

All Notifications endpoints require the `Authorization: Bearer <token>` header. 
*Note: Notifications are generated automatically in the background (via Cron) 3 hours and 10 minutes before a Todo's deadline.*

### Get Notifications feed
**GET** `/api/notifications`
- **Description**: Fetches the 50 most recent notifications for the user (perfect for an in-app "Bell" indicator feed).
- **Response (200 OK)**
  ```json
  [
    {
      "_id": "notif123",
      "title": "Task Deadline Imminent!",
      "message": "Your task 'Buy groceries' is due in 10 minutes!",
      "read": false,
      "todoId": "abc1234",
      "userId": "60d5ec...",
      "createdAt": "..."
    }
  ]
  ```

### Mark Notifications as Read
**PUT** `/api/notifications`
- **Description**: Marks notifications as read to clear the unread badge.
- **Body** (JSON - Optional): 
  - To mark **ALL** unread notifications as read, send an empty body `{}`.
  - To mark a **SINGLE** notification as read, provide its ID:
    ```json
    {
      "notificationId": "notif123"
    }
    ```
- **Response (200 OK)**: `{ "success": true }`

---

## 👤 5. Profile API

Manage the currently authenticated user's profile settings.

### Get Profile
**GET** `/api/profile`
- **Response (200 OK)**
  ```json
  {
    "_id": "60d5ec...",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "createdAt": "..."
  }
  ```

### Update Profile
**PUT** `/api/profile`
- **Body** (JSON - provide only fields you wish to update):
  ```json
  {
    "name": "Jane Developer",
    "password": "newpassword123"
  }
  ```
- **Response (200 OK)**: Returns the updated Profile object.

---

## 📱 6. Device Token API (Push Notifications)

Register the device for Firebase Cloud Messaging (FCM) or Apple Push Notifications (APNs).

### Save Device Token
**POST** `/api/mobile/device-token`
- **Description**: Send the mobile device token here. The backend Cron Job will trigger real push notifications 3 hours and 10 minutes before a Todo deadline using this token identity.
- **Body** (JSON):
  ```json
  {
    "deviceToken": "dpX9_..."
  }
  ```
- **Response (200 OK)**
  ```json
  {
    "success": true,
    "message": "Device token saved successfully"
  }
  ```
---

## 💻 7. DSA API (Data Structures & Algorithms)

All DSA endpoints require the `Authorization: Bearer <token>` header and are available at `/api/mobile/dsa`.

### Get All DSA Entries
**GET** `/api/mobile/dsa`
- **Description**: Fetches all DSA problems and theory notes for the user.
- **Response (200 OK)**:
  ```json
  [
    {
      "_id": "dsa123",
      "title": "Two Sum",
      "type": "problem",
      "difficulty": "Easy",
      "category": "Arrays",
      "updatedAt": "..."
    }
  ]
  ```

### Create a DSA Entry
**POST** `/api/mobile/dsa`
- **Body** (JSON):
  ```json
  {
    "title": "Two Sum",
    "type": "problem",
    "difficulty": "Easy",
    "category": "Arrays",
    "problemLink": "https://leetcode.com/problems/two-sum/",
    "problemStatement": "Given an array of integers...",
    "notes": "Think about HashMaps for O(n) time.",
    "solutions": [
      {
        "approach": "optimal",
        "language": "javascript",
        "code": "...",
        "explanation": "Using a Map to store indices.",
        "timeComplexity": "O(n)",
        "spaceComplexity": "O(n)"
      }
    ]
  }
  ```
- **Response (201 Created)**: Returns the created DSA object.

### Get/Update/Delete DSA Entry
**GET / PUT / DELETE** `/api/mobile/dsa/:id`
- **Params**: `id` - The `_id` of the entry.
- **PUT Body**: Provide any fields to update (same structure as POST).
- **Response**: 200 OK with the object or success message.

