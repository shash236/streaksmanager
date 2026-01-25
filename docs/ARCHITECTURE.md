# Architecture

## Implementation Structure
- **Frontend**: React
- **Backend**: Spring
- **Database**: H2 (Development), Postgres (Production)

## Core Functions
- Create, Update, Manage Streaks
- Track daily progress
- Visualize history (Month, Week, Last 5 Days)
- Metrics calculation

## REST APIs
### Endpoints
- **Create a streak**: `POST /api/v1/streaks`
- **Update a streak**: `PUT /api/v1/streaks/{id}`
- **Get streak details**: `GET /api/v1/streaks/{id}`
- **Start streak**: `POST /api/v1/streaks/{id}/start`
- **Pause streak**: `POST /api/v1/streaks/{id}/pause`
- **Archive streak**: `POST /api/v1/streaks/{id}/archive`
- **Mark done (Today)**: `POST /api/v1/streaks/{id}/checkin`
- **Mark undone (Today)**: `POST /api/v1/streaks/{id}/uncheck`

### Metrics & History
- **Get Metrics**: `GET /api/v1/streaks/{id}/metrics`
    - Current streak
    - Longest streak
- **Get History**: `GET /api/v1/streaks/{id}/history?range={week|month|last5}`
    - Returns list of check-in dates.

### Documentation
- **Swagger UI**: `/swagger-ui.html`
- **OpenAPI JSON**: `/v3/api-docs`
