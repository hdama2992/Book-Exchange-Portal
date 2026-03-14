# 📚 Book Exchange Portal

A premium, iOS-inspired web application for exchanging books between users. Features AI-powered book recognition, stunning animations, and a modern glassmorphism design.

![Book Exchange Portal](https://img.shields.io/badge/version-2.0-purple) ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.3-green) ![React](https://img.shields.io/badge/React-18-blue)

## ✨ Features

### Core Functionality
- 📖 **Smart Book Publishing** - Just upload a photo, AI extracts all book details automatically
- 🔍 **Browse & Discover** - Explore available books with beautiful card layouts
- 🤝 **Exchange Requests** - Request books and manage incoming/outgoing exchanges
- 📊 **Dashboard** - Track your published books, requests, and exchange history

### Premium UX
- 🎨 **iOS-Inspired Design** - Glassmorphism effects, SF Pro typography, smooth animations
- ✨ **Framer Motion Animations** - Fluid page transitions and micro-interactions
- 🌙 **Dark Mode Support** - Beautiful in both light and dark themes
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile

### AI-Powered
- 🤖 **Book Recognition** - OpenAI Vision API extracts title, author, year, ISBN from cover photos
- 📸 **Photo-First Publishing** - Upload a book cover → AI fills the details → One-click publish

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Spring Boot 3.2.3, Spring Security 6, Java 17 |
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion |
| **Database** | SQLite (file-based, zero config) |
| **Auth** | JWT + BCrypt, OAuth2 Ready (Google) |
| **AI** | OpenAI GPT-4 Vision API |

## 🚀 Getting Started

### Prerequisites

- Java 17+
- Node.js 18+
- Maven (or use included `./mvnw`)
- OpenAI API Key (optional, for AI book recognition)

### 1. Clone & Configure

```bash
git clone https://github.com/yourusername/Book-Exchange-Portal.git
cd Book-Exchange-Portal
```

### 2. Set Environment Variables (Optional)

For AI-powered book recognition, add your OpenAI key to `resources/application.properties`:

```properties
openai.api.key=your-openai-api-key
```

### 3. Run Backend

```bash
./mvnw spring-boot:run
```

Backend runs at: `http://localhost:8080`

### 4. Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5175`

## 📁 Project Structure

```
Book-Exchange-Portal/
├── java/                          # Backend source code
│   └── com/books/exchange/
│       ├── controllers/           # REST API endpoints
│       ├── entities/              # JPA entities (User, Book, Request)
│       ├── repositories/          # Spring Data JPA repositories
│       ├── services/              # Business logic + AI services
│       ├── security/              # JWT auth, OAuth2, filters
│       ├── config/                # App configuration
│       └── payloads/              # DTOs and API models
├── resources/
│   ├── application.properties     # Main config
│   └── uploads/                   # Uploaded book images
├── frontend/
│   ├── src/
│   │   ├── components/            # Reusable UI (ImageUpload, Toast, etc.)
│   │   ├── pages/                 # Page components
│   │   ├── context/               # React Context (Auth)
│   │   ├── hooks/                 # Custom hooks (useBooks, etc.)
│   │   ├── services/              # API client
│   │   └── lib/                   # Utilities & validations
│   ├── package.json
│   └── tailwind.config.js
├── pom.xml                        # Maven dependencies
└── books_exchange.db              # SQLite database (auto-created)
```

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login (returns JWT) |
| GET | `/api/auth/oauth-providers` | Check available OAuth providers |

### Books
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/books` | List all books |
| GET | `/api/books/available` | List available books |
| GET | `/api/books/user/{userId}` | Get user's books |
| POST | `/api/books/user/{userId}` | Publish a book |
| POST | `/api/books/recognize` | AI: Extract book info from image URL |

### Exchange Requests
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/requests/requester/{id}` | Get outgoing requests |
| GET | `/api/requests/owner/{id}` | Get incoming requests |
| POST | `/api/requests` | Create exchange request |
| PATCH | `/api/requests/{id}/approve` | Approve request |
| PATCH | `/api/requests/{id}/reject` | Reject request |

### Files
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/files/upload` | Upload image file |
| GET | `/uploads/{filename}` | Serve uploaded file |

## 🎨 Screenshots

### Login Page
Beautiful split-screen design with animated floating elements.

### Book Publishing
Three-step flow: Upload Photo → AI Processing → Confirm & Publish

### Browse Books
Modern card grid with hover effects and smooth animations.

## 🔐 Security

- **JWT Authentication** - Stateless token-based auth with configurable expiration
- **BCrypt Password Hashing** - Industry-standard password encryption
- **OAuth2 Ready** - Google Sign-In support (configure credentials in `application.properties`)
- **Rate Limiting** - Built-in request rate limiting to prevent abuse
- **CORS Configured** - Secure cross-origin setup for frontend

## 📝 Configuration

Key settings in `resources/application.properties`:

```properties
# JWT
jwt.secret=your-secret-key
jwt.expiration=86400000

# OpenAI (for AI book recognition)
openai.api.key=sk-...

# OAuth2 (optional)
spring.security.oauth2.client.registration.google.client-id=your-client-id
spring.security.oauth2.client.registration.google.client-secret=your-secret
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

---

Built with ❤️ using Spring Boot + React
