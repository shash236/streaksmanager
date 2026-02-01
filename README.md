# StreaksManager

A full-stack application to create and manage streaks, built with Spring Boot (backend) and React/Vite (frontend).

## Prerequisites

Before running the project, ensure you have the following installed:

*   **Java 21** (Required for the backend)
*   **Node.js & npm** (Required for the frontend)
*   **PostgreSQL 18** (Database)

## Getting Started

Follow these steps to set up the project locally.

### 1. Database Setup

The backend requires a PostgreSQL database running locally on port `5432` with specific credentials.

1.  **Start PostgreSQL service**
    *   **Mac (Homebrew):** `brew services start postgresql@18`
    *   **Docker:** `docker run --name streakman-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres`

2.  **Create Database and User**
    You need a database named `streakman` and a user `postgres` with password `postgres`. Run the following commands:

    ```bash
    # Create the database
    createdb streakman

    # Access Postgres prompt to create user (if not using Docker/default postgres user)
    psql postgres
    ```

    Inside the `psql` prompt, run:
    ```sql
    CREATE USER postgres WITH SUPERUSER PASSWORD 'postgres';
    -- Type \q to exit
    ```

### 2. Backend Setup (Spring Boot)

The backend is located in the `streakmanserver` directory.

1.  Navigate to the directory:
    ```bash
    cd streakmanserver
    ```

2.  Run the application:
    ```bash
    ./mvnw spring-boot:run
    ```

The server will start on **http://localhost:8080**.

> **Note:** If you see a "Port 8080 was already in use" error, verify that no other process is running on that port: `lsof -i :8080`.

### 3. Frontend Setup (React + Vite)

The frontend is located in the `streakmanui` directory.

1.  Open a new terminal and navigate to the directory:
    ```bash
    cd streakmanui
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```

The UI will be accessible at **http://localhost:5173**.

## Project Structure

*   **/streakmanserver**: Spring Boot backend API.
*   **/streakmanui**: React frontend application.