# 🤖 XumtechBot - Modern Conversational Chatbot

A complete, enterprise-grade conversational chatbot built with Node.js, Express, SQLite, and vanilla JavaScript. Features a modern, responsive UI with real-time messaging, intelligent pattern matching, and comprehensive security measures.

![XumtechBot Demo](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-18.0+-green)
![Express](https://img.shields.io/badge/Express-4.18+-blue)
![SQLite](https://img.shields.io/badge/SQLite-3.0+-orange)

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Security Features](#-security-features)
- [Database Schema](#-database-schema)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🤖 Chatbot Capabilities
- **Intelligent Pattern Matching**: Advanced keyword recognition with Levenshtein distance algorithm
- **Contextual Responses**: Location-aware responses (Sevilla, Spain)
- **Real-time Messaging**: Instant message delivery with typing indicators
- **Conversation History**: Complete chat history with timestamps
- **Quick Suggestions**: Always-visible suggestion buttons for common queries
- **Multi-language Support**: Spanish language with easy localization

### 🎨 User Interface
- **Modern Design**: Clean, professional enterprise chatbot interface
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Floating Widget**: Bottom-right positioned chat button with smooth animations
- **Real-time Status**: Online/offline indicators with visual feedback
- **Smooth Animations**: CSS transitions and micro-interactions
- **Auto-scroll**: Automatic scrolling to latest messages
- **Fixed Input Area**: Input area stays in place during conversations

### 🔧 Technical Features
- **RESTful API**: Complete backend API with proper HTTP methods
- **Database Integration**: SQLite for data persistence and conversation logging
- **Security Headers**: Helmet.js with Content Security Policy
- **Rate Limiting**: Express-rate-limit for API protection
- **Input Validation**: Express-validator for data sanitization
- **Error Handling**: Comprehensive error management and logging
- **CORS Support**: Cross-origin resource sharing configuration

### 📊 Admin Features
- **Authentication**: JWT-based admin authentication
- **Conversation Logs**: Complete chat history tracking
- **Statistics**: Message counts and user interaction analytics
- **Export Functionality**: Chat history export to text files
- **Configuration Management**: Bot settings and response customization

## 🛠 Technology Stack

### Backend
- **Node.js** (v18.0+) - Runtime environment
- **Express.js** (v4.18+) - Web framework
- **SQLite3** (v3.0+) - Database
- **Helmet.js** - Security headers
- **Express-rate-limit** - Rate limiting
- **Express-validator** - Input validation
- **Bcrypt.js** - Password hashing
- **JWT** - Authentication tokens
- **CORS** - Cross-origin support

### Frontend
- **Vanilla JavaScript** (ES6+) - No framework dependencies
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Flexbox and Grid
- **Responsive Design** - Mobile-first approach

### Development Tools
- **npm** - Package management
- **dotenv** - Environment configuration
- **Nodemon** - Development server

## 🏗 Architecture

### Client-Server Architecture
```
┌─────────────────┐    HTTP/HTTPS    ┌─────────────────┐
│   Frontend      │ ◄──────────────► │    Backend      │
│   (Browser)     │                  │   (Node.js)     │
│                 │                  │                 │
│ • HTML/CSS/JS   │                  │ • Express.js    │
│ • Chat Widget   │                  │ • SQLite DB     │
│ • Responsive UI │                  │ • REST API      │
└─────────────────┘                  └─────────────────┘
```

### Data Flow
1. **User Input** → Frontend JavaScript
2. **API Request** → Express.js Backend
3. **Pattern Matching** → SQLite Database
4. **Response Generation** → Backend Processing
5. **UI Update** → Frontend Display

## 🚀 Installation

### Prerequisites
- Node.js (v18.0 or higher)
- npm (v8.0 or higher)
- Git

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/your-username/xumtech-chatbot.git
cd xumtech-chatbot
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

4. **Initialize the database**
```bash
npm run setup
```

5. **Start the development server**
```bash
npm start
```

6. **Open your browser**
```
http://localhost:3000
```

## ⚙️ Configuration

### Environment Variables (.env)
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_PATH=./data/chatbot.db

# Security Configuration
JWT_SECRET=your-super-secret-jwt-key
BCRYPT_ROUNDS=12

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### Database Setup
The application automatically creates the following tables:
- `users` - Admin user accounts
- `bot_config` - Chatbot configuration
- `queries` - Pattern matching data
- `conversations` - Chat history logs

## 📖 Usage

### Starting the Application

**Development Mode:**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

**Database Setup:**
```bash
npm run setup
```

### Using the Chatbot

1. **Open the application** in your browser
2. **Click the chat button** (bottom-right corner)
3. **Type your message** or use quick suggestions
4. **Receive instant responses** from the intelligent bot

### Available Commands

**Frontend Functions:**
```javascript
// Open/close chat
toggleChat()

// Send a message
sendMessage()

// Send a suggestion
sendSuggestion('¿Qué servicios ofrecen?')

// Clear chat history
clearChat()

// Export chat history
exportChat()

// Get chat statistics
getChatStats()
```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

#### POST /api/auth/login
**Admin login endpoint**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt-token-here",
  "message": "Login successful"
}
```

### Chatbot Endpoints

#### POST /api/chat
**Send a message to the chatbot**
```json
{
  "message": "¿Qué servicios ofrecen?"
}
```

**Response:**
```json
{
  "success": true,
  "response": "En Xumtech ofrecemos desarrollo web, aplicaciones móviles, consultoría tecnológica y soluciones digitales.",
  "confidence": 0.95
}
```

#### GET /api/chat/history
**Get conversation history**
```json
{
  "success": true,
  "conversations": [
    {
      "id": 1,
      "user_message": "¿Qué servicios ofrecen?",
      "bot_response": "En Xumtech ofrecemos...",
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Admin Endpoints

#### GET /api/admin/stats
**Get chatbot statistics**
```json
{
  "success": true,
  "stats": {
    "total_conversations": 150,
    "total_messages": 450,
    "average_response_time": 1.2,
    "popular_queries": ["servicios", "contacto", "horarios"]
  }
}
```

## 🔒 Security Features

### Content Security Policy (CSP)
```javascript
// Configured in server.js
contentSecurityPolicy: {
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    fontSrc: ["'self'", "https://fonts.gstatic.com"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    scriptSrcAttr: ["'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "https:"],
    connectSrc: ["'self'"]
  }
}
```

### Security Headers
- **Helmet.js**: Comprehensive security headers
- **Rate Limiting**: API protection against abuse
- **Input Validation**: Data sanitization and validation
- **CORS**: Cross-origin resource sharing
- **JWT Authentication**: Secure admin access

### Database Security
- **SQL Injection Protection**: Parameterized queries
- **Data Sanitization**: Input cleaning and validation
- **Password Hashing**: Bcrypt with configurable rounds

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Bot Config Table
```sql
CREATE TABLE bot_config (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Queries Table
```sql
CREATE TABLE queries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  intent TEXT NOT NULL,
  patterns TEXT NOT NULL,
  response TEXT NOT NULL,
  confidence REAL DEFAULT 1.0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Conversations Table
```sql
CREATE TABLE conversations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  user_message TEXT NOT NULL,
  bot_response TEXT NOT NULL,
  confidence REAL,
  response_time REAL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 📁 Project Structure

```
MINI-BOT-CHATBOT/
├── backend/
│   ├── server.js              # Main Express server
│   ├── setup/
│   │   └── database.js        # Database initialization
│   ├── routes/
│   │   ├── auth.js           # Authentication routes
│   │   └── chat.js           # Chatbot API routes
│   ├── middleware/
│   │   ├── auth.js           # JWT authentication
│   │   └── validation.js     # Input validation
│   └── data/
│       └── chatbot.db        # SQLite database
├── frontend/
│   ├── index.html            # Main HTML file
│   ├── css/
│   │   └── styles.css        # Complete styling
│   └── js/
│       ├── chatbot.js        # Chatbot logic
│       ├── api.js           # API communication
│       └── app.js           # General app logic
├── package.json              # Dependencies and scripts
├── .env                      # Environment variables
├── .gitignore               # Git ignore rules
└── README.md                # This file
```

## 🎯 Key Features Implementation

### Pattern Matching Algorithm
```javascript
// Advanced keyword matching with confidence scoring
function getBotResponse(userMessage) {
  const message = userMessage.toLowerCase();
  
  for (const [key, data] of Object.entries(botKnowledge)) {
    if (data.keywords.some(keyword => message.includes(keyword))) {
      return data.response;
    }
  }
  
  return "Disculpa, no entendí tu consulta...";
}
```

### Real-time UI Updates
```javascript
// Smooth message addition with auto-scroll
function addMessage(sender, content) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}-message`;
  
  // Add message to DOM
  messagesContainer.appendChild(messageDiv);
  
  // Smooth scroll to bottom
  setTimeout(() => {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }, 100);
}
```

### Responsive Design
```css
/* Mobile-first responsive design */
@media (max-width: 480px) {
  .chat-window {
    width: calc(100vw - 20px);
    height: calc(100vh - 40px);
  }
}
```

## 🚀 Deployment

### Production Setup

1. **Environment Configuration**
```bash
NODE_ENV=production
PORT=3000
JWT_SECRET=your-production-secret
```

2. **Database Migration**
```bash
npm run setup
```

3. **Start Production Server**
```bash
npm start
```

### Docker Deployment (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Style
- Use ES6+ JavaScript features
- Follow consistent naming conventions
- Add comments for complex logic
- Maintain responsive design principles


