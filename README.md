# TypeScript Backend Starter with PostgreSQL, Express, and Node.js

A flexible backend starter built with **TypeScript**, **PostgreSQL**, **Express**, and **Node.js**. This boilerplate is designed to be backend-agnostic, allowing you to easily connect it with any frontend framework such as **React**, **Angular**, **Vue**, or a custom solution.

## Features

* **TypeScript**: Strongly typed JavaScript for a better development experience.
* **Express**: Minimal and flexible Node.js web application framework.
* **PostgreSQL**: Powerful open-source relational database.
* **Backend-Agnostic**: Easily connect to any frontend.
* **Easy Setup**: Quick initialization and project bootstrapping.
* **Docker Support**: Spin up PostgreSQL instantly with Docker.

## Requirements

* **Node.js** (v14 or later)
* **Docker** (optional, for local PostgreSQL setup)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/MeerUzairWasHere/TypePEN.git
cd TypePEN
```

---

### 2. Install Dependencies

```bash
cd backend && npm install
```

If you don't have TypeScript installed globally, install it with:

```bash
npm install -g typescript
```

Or install it locally in the project:

```bash
npm install --save-dev typescript
```

---

### 3. Set Up the Database

You have **two options** to set up the PostgreSQL database:

#### Option A: Use a Remote PostgreSQL Provider

1. Use services like [Neon](https://neon.tech), [ElephantSQL](https://www.elephantsql.com/), or your own hosted PostgreSQL.
2. Copy the connection string.
3. Rename `.env.example` to `.env` and paste your connection string:

```env
DATABASE_URL=your-remote-postgresql-connection-string
```

---

#### Option B: Use Docker Locally

1. Run the following command to spin up a PostgreSQL container:

```bash
npm run db
```

> This will create a PostgreSQL instance using Docker with default credentials defined in your `.env` file.

---

### 4. Run Migrations

Before starting the server for the first time, apply the initial database schema:

```bash
npm run dev:migrate
```

> This command pushes the initial Prisma migration files to the database.

---

### 5. Start the Server

Run the backend server:

```bash
npm run dev
```

If everything is set up correctly, you’ll see:

```
Server is listening on http://localhost:3000/
```

The default port can be changed via the `.env` file.

---

### 6. Swagger Documentation (Optional)

On first run, the server may redirect you to an API documentation page powered by Swagger UI.

If you **don’t want** Swagger documentation, **comment out or remove** the Swagger-related code in `index.ts`.

---

## Connecting with Frontend Frameworks

This backend can be used with:

* **React**
* **Vue**
* **Angular**
* Or any other frontend via REST API calls.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

### 🙋‍♂️ Need Help?

If you have questions or need help getting started, feel free to reach out!
