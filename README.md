# Local Internet Interview

A full-stack local community platform built to connect users with useful information from their local area.

The application allows users to create and discover local posts, search for information, interact through comments and replies, report inappropriate content, and use AI-powered analysis to understand natural-language posts.

## 🚀 Features

* User registration and login
* Secure password hashing with BCrypt
* Create and view local posts
* AI-powered post analysis
* Intent, topic, location, and urgency detection
* Search local posts
* Comments and replies
* Report posts
* User profile
* AI-powered local chat
* REST API based communication
* MySQL database integration

## 🛠️ Technologies Used

### Frontend

* React
* JavaScript
* React Router
* Vite
* CSS

### Backend

* Java
* Spring Boot
* Spring MVC
* Spring Data JPA
* Hibernate
* REST APIs
* Bean Validation
* BCrypt

### Database

* MySQL

### AI

* OpenAI API
* Structured JSON response
* Rule-based fallback analysis

## 🏗️ Architecture

```text
React Frontend
      ↓
Spring Boot REST Controller
      ↓
Service Layer
      ↓
Repository Layer
      ↓
MySQL Database
```

The AI integration is handled inside the Spring Boot backend. The React frontend communicates only with the backend APIs.

## 🤖 AI Integration

The application uses AI to understand natural-language local posts.

For example:

> "I need a mechanic near Madhapur today."

The AI analyzes the content and identifies information such as:

* **Intent:** NEED
* **Topic:** VEHICLE
* **Location:** Madhapur
* **Urgency:** Based on the wording and context

This structured information can then be used by the backend to provide more relevant local results.

If the external AI service is unavailable, the application uses a local rule-based fallback so that the core functionality can continue working.

## 🔐 Security

* Passwords are never stored as plain text.
* BCrypt is used for password hashing.
* AI API credentials are kept on the backend using environment variables.
* The frontend does not directly access the AI API.

## 📂 Project Structure

```text
local-internet-interview/
│
├── backend/
│   ├── src/
│   ├── pom.xml
│   └── ...
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── ...
│
└── README.md
```

## 🎯 Project Purpose

The goal of this project was to build a practical full-stack application rather than a simple CRUD application.

It demonstrates:

* Full-stack development
* REST API design
* Database relationships
* Authentication
* React frontend development
* AI integration
* Input validation
* Error handling
* Backend business logic

## 👨‍💻 Developer

**Anil Nalamati**

Java Full Stack Developer
