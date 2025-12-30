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
