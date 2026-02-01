# Architecture Decisions Log

## 0001 - Init Project Structure
**Date:** 2025-12-31
**Status:** Accepted

### Context
We need a structure to document the project and its decisions.

### Decision
We will use a `docs/` folder for documentation and `tasks/` for task management.

### Consequences
- `PROJECT.md` for overview.
- `docs/DECISIONS.md` for decision log.
- `docs/ARCHITECTURE.md` for architecture details.
- `tasks/current-task.md` for tracking active work.

## 0002 - Tech Stack Selection
**Date:** 2025-12-31
**Status:** Accepted

### Context
We need to select a technology stack for the Streaks Manager application to support the desired features and scalability.

### Decision
We will use:
- **Frontend:** React
- **Backend:** Spring Boot
- **Database:** DynamoDB

### Consequences
- Allows for a modern, reactive frontend.
- Robust backend with Spring ecosystem.
- Scalable, serverless database with DynamoDB.

## 0003 - Backend Implementation Strategy
**Date:** 2026-01-25
**Status:** Accepted

### Context
We needed to implement the core CRUD and logic for the Streaks Manager API.

### Decision
- **Spring Boot 3.4.1**: Updated from an invalid version to ensure stability.
- **JPA/Hibernate**: For Object-Relational Mapping (replacing DynamoDB idea for now to stick to relational structure with H2/Postgres for easier development).
- **StreakEntry Entity**: To track individual check-ins, allowing for history reconstruction and detailed views (Week/Month).
- **SpringDoc OpenAPI**: To automatically generate API documentation and Swagger UI.

### Consequences
- Need to maintain relational schema.
- API documentation is auto-generated and stays in sync with code.
- `StreakService` handles business logic including streak counting and history retrieval.

## 0004 - Authentication & Ownership
**Date:** 2026-02-01
**Status:** Accepted

### Context
We needed to secure the application and ensure users can only see and manage their own streaks.

### Decision
- **Mock OTP Auth**: Implemented a phone number based login with a mock OTP printed to console for MVP.
- **Token-based Security**: Simple Bearer token mechanism.
- **Data Ownership**: Added `userId` to `Streak` entity. All filtering happens at the service/repository level based on the authenticated user.

### Consequences
- Requires users to log in.
- Prevents cross-user data leakage (403 Forbidden fixed by enforcing filters).
- "Mock" nature means it's not ready for public release without a real SMS provider.

## 0005 - UI Architecture
**Date:** 2026-02-01
**Status:** Accepted

### Context
We needed a navigation structure and a way to view streaks.

### Decision
- **Sidebar Navigation**: A collapsible sidebar for main navigation (Dashboard, Profile, Logout).
- **Dashboard Layout**: Card-based layout for streaks.
- **Streak Cards**: Individual cards showing current/best streaks, with "Edit" and "Archive" actions.

### Consequences
- Provides a scalable layout for adding more pages.
- Clean separation of concerns in UI components.
