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

## ✅ 2. Todos API

All Todo endpoints require the `Authorization: Bearer <token>` header.

### Get All Todos
**GET** `/api/todos`
- **Description**: Fetches all todos for the authenticated user, sorted by creation date (newest first).
- **Response (200 OK)**
  ```json
  [
    {
      "_id": "abc1234",
      "title": "Buy groceries",
      "description": "Milk, Eggs, Bread",
      "status": "pending",
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
    "title": "New Task",
    "description": "Optional details",
    "status": "pending", 
    "deadline": "2026-04-01T10:00:00.000Z" // Optional, ISO string
  }
  ```
- **Response (201 Created)**: Returns the newly created Todo object.

### Update a Todo
**PUT** `/api/todos/:id`
- **Params**: `id` - The `_id` of the Todo to update.
- **Body** (JSON): Provide only the fields you wish to change. For example, to toggle status:
  ```json
  {
    "status": "completed"
  }
  ```
- **Response (200 OK)**: Returns the updated Todo object.

### Delete a Todo
**DELETE** `/api/todos/:id`
- **Params**: `id` - The `_id` of the Todo to delete.
- **Response (200 OK)**: `{ "message": "Todo deleted successfully" }`

---

## 📝 3. Notes API

All Notes endpoints require the `Authorization: Bearer <token>` header.

### Get All Notes
**GET** `/api/notes`
- **Description**: Fetches all Markdown notes for the authenticated user, sorted by last updated.
- **Response (200 OK)**
  ```json
  [
    {
      "_id": "xyz987",
      "title": "Project Ideas",
      "content": "# Idea 1\nThis is a markdown note...",
      "userId": "60d5ec...",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
  ```

### Create a Note
**POST** `/api/notes`
- **Body** (JSON):
  ```json
  {
    "title": "New Note",
    "content": "Start typing here..."
  }
  ```
- **Response (201 Created)**: Returns the newly created Note object.

### Update a Note
**PUT** `/api/notes/:id`
- **Params**: `id` - The `_id` of the Note to update.
- **Body** (JSON):
  ```json
  {
    "title": "Updated Title",
    "content": "Updated content here..."
  }
  ```
- **Response (200 OK)**: Returns the updated Note object.

### Delete a Note
**DELETE** `/api/notes/:id`
- **Params**: `id` - The `_id` of the Note to delete.
- **Response (200 OK)**: `{ "message": "Note deleted successfully" }`

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
