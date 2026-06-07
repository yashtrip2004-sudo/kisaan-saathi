# Backend Integration Guide

This guide outlines the API endpoints and data structures required by the frontend application.

## Base URL
All endpoints should be prefixed with `/api`.
Example: `http://localhost:5000/api`

## Authentication

### 1. Login
**Endpoint:** `POST /auth/login`
**Description:** Authenticates a user.

**Request Body:**
```json
{
  "mobile": "9876543210",
  "password": "password123"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "name": "Ram Kumar",
    "mobile": "9876543210"
  }
}
```

**Response (Error - 401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### 2. Register
**Endpoint:** `POST /auth/register`
**Description:** Registers a new user.

**Request Body:**
```json
{
  "name": "Ram Kumar",
  "mobile": "9876543210",
  "password": "password123"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "User registered successfully"
}
```

---

## Features

### 3. Upload Crop Image
**Endpoint:** `POST /crop/upload`
**Description:** Uploads a crop image for disease analysis.

**Request:** `multipart/form-data`
- `image`: The image file (jpg, png, etc.)
- `crop`: Crop type (e.g., "Wheat", "Rice") [Optional but recommended]

**Response (Success - 200):**
```json
{
  "crop": "Tomato",
  "disease": "Leaf Blight",
  "confidence": 91,
  "advice": [
    "Use copper-based fungicide",
    "Avoid watering at night"
  ]
}
```

### 4. AI Chatbot
**Endpoint:** `POST /chat`
**Description:** Sends a message to the AI assistant.

**Request Body:**
```json
{
  "message": "My tomato plants have yellow leaves. What should I do?"
}
```

**Response (Success - 200):**
```json
{
  "reply": "Yellow leaves on tomato plants can indicate nitrogen deficiency or overwatering. Try adding a nitrogen-rich fertilizer."
}
```

### 5. Update Profile
**Endpoint:** `POST /profile` (or `PUT /profile`)
**Description:** Updates the user's profile details.

**Request Body:**
```json
{
  "name": "Ram Kumar",
  "mobile": "9876543210",
  "state": "Punjab",
  "district": "Ludhiana",
  "crops": "Wheat, Rice"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Profile updated successfully"
}
```

---

## Data Models (Frontend Types)

**User:**
```typescript
type User = {
    name: string;
    mobile: string;
    state: string;
    district: string;
    crops: string;
    language: string;
};
```

**CropAnalysisResult:**
```typescript
type CropAnalysisResult = {
    crop: string;
    disease: string;
    confidence: number;
    advice: string[];
};
```
