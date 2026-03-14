# 📚 Book Exchange Portal

A modern web application for exchanging books between users. Built with Spring Boot and React.

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Spring Boot 2.6, Spring Security, JWT |
| **Frontend** | React 18, Vite, Tailwind CSS |
| **Database** | SQLite (file-based) |
| **Auth** | JWT + BCrypt |

## Features

- ✅ User registration & login (JWT authentication)
- ✅ Publish books for exchange
- ✅ Browse available books
- ✅ Request book exchanges
- ✅ Approve/reject incoming requests
- ✅ Track exchange history

## Getting Started

### Prerequisites

- Java 17+
- Node.js 18+
- Maven (or use included `./mvnw`)

### Run Backend

```bash
./mvnw spring-boot:run
```

Backend runs at: `http://localhost:8080`

### Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

## Project Structure

```
Book-Exchange-Portal/
├── java/                    # Backend source code
│   └── com/books/exchange/
│       ├── controllers/     # REST endpoints
│       ├── entities/        # JPA entities
│       ├── repositories/    # Data access
│       ├── services/        # Business logic
│       ├── security/        # JWT & Spring Security
│       └── payloads/        # DTOs
├── resources/
│   └── application.properties
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   └── services/        # API calls
│   └── package.json
├── pom.xml                  # Maven config
└── books_exchange.db        # SQLite database (auto-created)
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/books` | List all books |
| POST | `/api/books` | Publish a book |
| POST | `/api/requests` | Request a book |
| PATCH | `/api/requests/{id}/approve` | Approve request |

## License

MIT
