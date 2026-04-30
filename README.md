# TypeScript Backend Starter with PostgreSQL, NestJS, and Node.js

A powerful and flexible **TypeScript backend boilerplate** built on top of **NestJS** and **PostgreSQL**, designed for a clean modular backend without the custom Express wiring layer.

This starter includes:

* **Native NestJS modules, controllers, guards, and filters**
* **Zod-based request validation**
* **Prisma ORM for PostgreSQL**
* **Cookie-based auth with role-aware guards**
* **Swagger/OpenAPI docs**

---

## ✨ Features

* ⚙️ **TypeScript** — Strong typing for reliability and better DX.
* 🚀 **NestJS** — Structured backend framework with DI and HTTP abstractions.
* 🧩 **Modular architecture** — Organized controllers, services, guards, filters, and repositories.
* 🧠 **Dependency Injection (DI)** — Loosely coupled components for easier testing and extension.
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
│   ├── repositories/
│   ├── pipes/
│   ├── services/
│   ├── types/
│   ├── utils/
│   ├── validators/
│   ├── app.module.ts         # Root Nest module
│   ├── index.ts              # Application entry point
│   └── openApiSpec.ts        # Swagger/OpenAPI definition
├── .env
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

> This structure follows the **NestJS modular model** while keeping the existing Prisma repository and service layers intact.

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
npm run migrate
```

### 5. Start the Server

```bash
npm run dev
```

Server will start on [http://localhost:3000](http://localhost:3000)

---

## 🧩 Dependency Injection and Extensibility

This boilerplate uses **NestJS dependency injection**, so controllers, services, repositories, and guards are wired through providers instead of a manual container.

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

This design allows future **modules** or **providers** (e.g. EmailService, CacheService) to be added without changing the application bootstrap.

---

## 🧱 Framework Philosophy

* **NestJS modularity** for organization.
* **Prisma-backed services and repositories** for data access.
* **Class-based design** for scalability.
* **DI-first approach** for maintainability.

---

## 🧾 License

Licensed under the [MIT License](LICENSE).

---
