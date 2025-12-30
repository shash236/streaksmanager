# Architecture

## Implementation Structure
- **Frontend**: React
- **Backend**: Spring
- **Database**: DynamoDB

## Core Functions
- Create a Streak
- Add description
- Start tracking
- Webhooks (API layer)

## REST APIs
### Endpoints
- **Create a streak**: `POST /streaks`
- **Add description**: `PUT /streaks/{id}/description`
- **Start streak**: `POST /streaks/{id}/start`
- **Pause streak**: `POST /streaks/{id}/pause`
- **Archive streak**: `POST /streaks/{id}/archive`
- **Mark done (Today)**: `POST /streaks/{id}/check`
- **Mark done (Specific Date)**: `POST /streaks/{id}/check?date={yyyy-mm-dd}`
- **Mark undone (Today)**: `POST /streaks/{id}/uncheck`
- **Mark undone (Specific Date)**: `POST /streaks/{id}/uncheck?date={yyyy-mm-dd}`

### Metrics
- **Short metrics**:
    - Current streak
    - Longest streak

### API Layer
- **Webhooks**: Handling external events.
- **Get Metrics APIs**: Retrieving streak statistics.
