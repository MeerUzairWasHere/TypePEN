# TypeScript Backend Starter with PostgreSQL, Express, and Node.js

A powerful and flexible **TypeScript backend boilerplate** built on top of **Express** and **PostgreSQL**, designed with a **NestJS-inspired modular architecture** — offering both **structure and freedom**.

This starter brings the best of both worlds:

* **NestJS-style project structure** (with `guards`, `filters`, `decorators`, `dto`, `repositories`, etc.)
* **Express-level flexibility**
* **Class-based architecture** with **Dependency Injection (DI)** for easy scalability and plugin-based extensibility.

---

## ✨ Features

* ⚙️ **TypeScript** — Strong typing for reliability and better DX.
* 🚀 **Express** — Lightweight, unopinionated, and extremely flexible.
* 🧩 **NestJS-inspired architecture** — Organized modules with `controllers`, `services`, `guards`, `filters`, and more.
* 🧠 **Dependency Injection (DI)** — Loosely coupled components for easier testing and plugin integration.
* 🗄️ **PostgreSQL + Prisma ORM** — Powerful schema management and migrations.
* 🔐 **Guards, Filters, Decorators** — Extendable request handling and validation patterns.
* 📦 **DTOs and Validators (Zod)** — Type-safe input validation.
* 🐳 **Docker Support** — Instantly spin up PostgreSQL locally.
* 🧰 **Utility-first design** — Clean structure for middlewares, repositories, and helpers.
* 📜 **OpenAPI/Swagger** — Auto-generated API documentation.

---

## 📁 Project Structure

```
backend/
├── dist/
├── node_modules/
├── prisma/
├── src/
│   ├── configs/
│   ├── controllers/
│   ├── decorators/
│   ├── dto/
│   ├── errors/
│   ├── filters/
│   ├── guards/
│   ├── interfaces/
│   ├── middlewares/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   ├── types/
│   ├── utils/
│   ├── validators/
│   ├── container.ts          # Dependency Injection container
│   ├── index.ts              # Application entry point
│   └── openApiSpec.ts        # Swagger/OpenAPI definition
├── .env
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

> This structure follows the **NestJS philosophy of modular separation**, but keeps **Express’s unopinionated nature**, giving you full control over middleware and routing.

---

## ⚡ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/MeerUzairWasHere/TypePEN.git
cd TypePEN
```

### 2. Install Dependencies

```bash
cd backend && npm install
```

### 3. Set Up the Database

Use either a **remote PostgreSQL provider** (Neon, Supabase, ElephantSQL) or **local Docker setup**.

#### Option A: Remote Database

Rename `.env.example` → `.env` and add your connection string:

```env
DATABASE_URL=your-postgresql-url
```

#### Option B: Local Docker Database

```bash
npm run db
```

---

### 4. Run Migrations

```bash
npm run dev:migrate
```

### 5. Start the Server

```bash
npm run dev
```

Server will start on [http://localhost:3000](http://localhost:3000)

---

## 🧩 Dependency Injection and Extensibility

This boilerplate uses a **class-based architecture** with a **DI container** (`container.ts`), enabling clean dependency management between services, repositories, and controllers.

Example:

```ts
// user.service.ts
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async findAll() {
    return this.userRepository.findMany();
  }
}
```

This design allows future **plugins** or **modules** (e.g., EmailService, CacheService) to be added seamlessly.

---

## 🧱 Framework Philosophy

* **NestJS-like modularity** for organization.
* **Express-like flexibility** for freedom.
* **Class-based design** for scalability.
* **DI-first approach** for maintainability.

---

## 🧾 License

Licensed under the [MIT License](LICENSE).

---
