# 💧 Water Level IoT System — Backend

Backend service for a real-time water level monitoring system built with Arduino UNO + HW-262 sensor shield.

## 🏗️ Architecture

This project follows a **Layered Architecture** pattern:

```
Controller → Service → Repository → Database
```

- **Domain entities** decoupled from Prisma models
- **Strict TypeScript** (no implicit any, strict null checks)
- **Real-time** data streaming via Socket.io
- **Smart persistence** — saves on interval + critical events

## 🛠️ Tech Stack

| Layer      | Technology               |
| ---------- | ------------------------ |
| Framework  | NestJS                   |
| Language   | TypeScript (strict mode) |
| ORM        | Prisma                   |
| Database   | PostgreSQL               |
| Real-time  | Socket.io                |
| Validation | class-validator          |
| Docs       | Swagger / OpenAPI        |

## 📡 Hardware Integration

```
Arduino UNO + HW-262
       ↓
Python Serial Bridge (HTTP)
       ↓
NestJS Backend
       ↓
Socket.io → React Frontend
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/MenHec95/water-level-iot-system

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your values

# Run database migrations
npx prisma migrate dev

# Start development server
npm run start:dev
```

## 🔌 API Endpoints

| Method | Endpoint           | Description                        |
| ------ | ------------------ | ---------------------------------- |
| POST   | `/readings`        | Receive reading from serial bridge |
| GET    | `/readings`        | Get paginated readings history     |
| GET    | `/readings/latest` | Get latest reading                 |
| GET    | `/readings/stats`  | Get aggregated statistics          |
| POST   | `/simulator/start` | Start data simulator               |
| POST   | `/simulator/stop`  | Stop data simulator                |

## 🌐 WebSocket Events

| Event              | Direction       | Description             |
| ------------------ | --------------- | ----------------------- |
| `reading:new`      | Server → Client | New sensor reading      |
| `reading:alert`    | Server → Client | Critical event detected |
| `simulator:status` | Server → Client | Simulator state change  |

## ⚙️ Environment Variables

See `.env.example` for all required variables.

## 📦 Project Structure

```
src/
├── common/          # Shared filters, guards, interceptors
├── config/          # Centralized configuration
├── modules/
│   ├── readings/    # Core IoT data module
│   └── simulator/   # Mock data generator
├── prisma/          # Database layer
├── app.module.ts
└── main.ts
```

## 🔗 Related Repositories

- [Arduino Firmware + Python Serial Bridge](https://github.com/MenHec95/water-level-iot-system)

## 📄 License

MIT
