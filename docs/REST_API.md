### Base URL
- **REST**: http://localhost:3001/api/v1

### Health
- **GET /**: Health check
- **GET /status**: Detailed status

curl examples:
```bash
curl -s http://localhost:3001/api/v1/
curl -s http://localhost:3001/api/v1/status
```

### Authentication (auth)
- **POST /auth/login**: Login, returns JWTs
- **POST /auth/register**: Register user
- **POST /auth/refresh**: Refresh access token
- **GET /auth/profile**: Get current user (auth)
- **POST /auth/logout**: Logout (auth)
- **GET /auth/validate**: Validate token (auth)

Example:
```bash
curl -s -X POST http://localhost:3001/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@example.com","password":"password123"}'
```

Auth-protected requests include header:
```
Authorization: Bearer <ACCESS_TOKEN>
```

### RBAC (rbac)
- POST /rbac/roles (ORG_ADMIN, role:create)
- GET /rbac/roles?includeUserCount=true
- GET /rbac/roles/:roleId
- PUT /rbac/roles/:roleId (ORG_ADMIN, role:update)
- DELETE /rbac/roles/:roleId (ORG_ADMIN, role:delete)
- POST /rbac/users/:userId/roles (ORG_ADMIN, role:assign)
- DELETE /rbac/users/:userId/roles/:roleId (ORG_ADMIN, role:assign)
- GET /rbac/users/:userId/roles
- GET /rbac/permissions
- POST /rbac/initialize-system-roles (SUPER_ADMIN)

Create role:
```bash
curl -s -X POST http://localhost:3001/api/v1/rbac/roles \
  -H 'Authorization: Bearer $TOKEN' -H 'Content-Type: application/json' \
  -d '{"name":"Content Manager","description":"Can manage content","permissions":["posts:create","posts:update"]}'
```

### Subscriptions (subscriptions)
- POST /subscriptions: Create subscription
  - body: { channel: string, filters?: { eventTypes?: string[], metadata?: object, priority?: 'low'|'medium'|'high' } }
- GET /subscriptions: List current user subscriptions
- GET /subscriptions/organization: List org subscriptions (admin only)
- GET /subscriptions/channel/:channel/subscribers: List channel subscribers
- GET /subscriptions/:id: Get by ID
- PUT /subscriptions/:id: Update { filters?, isActive? }
- DELETE /subscriptions/:id: Soft-delete
- GET /subscriptions/validate/:channel: Validate if current user is subscribed

Example create:
```bash
curl -s -X POST http://localhost:3001/api/v1/subscriptions \
  -H 'Authorization: Bearer $TOKEN' -H 'Content-Type: application/json' \
  -d '{"channel":"agent_events","filters":{"eventTypes":["agent_started"],"priority":"medium"}}'
```

### Audit (audit)
- GET /audit/logs
  - query: userId, action, resourceType, category, severity, success, startDate, endDate, limit, offset
- GET /audit/summary?startDate=ISO&endDate=ISO
- GET /audit/security-events?startDate=ISO&endDate=ISO&severity=HIGH,CRITICAL
- GET /audit/anomalies?timeWindow=ms
- GET /audit/compliance-report?reportType=GDPR|SOX|HIPAA|PCI_DSS&startDate=ISO&endDate=ISO
- POST /audit/log-event
  - body: { action, resourceType, resourceId?, oldValues?, newValues?, success?, error?, metadata?, severity?, category? }
- GET /audit/export?format=json|csv&startDate=ISO&endDate=ISO&category&severity
- GET /audit/dashboard?timeRange=1h|24h|7d|30d

Export CSV:
```bash
curl -s 'http://localhost:3001/api/v1/audit/export?format=csv&startDate=2025-08-01T00:00:00Z&endDate=2025-08-06T00:00:00Z' \
  -H 'Authorization: Bearer $TOKEN' > audit.csv
```

### Monitoring / Latency (monitoring/latency)
- GET /monitoring/latency/stats?operation=&timeWindow=&organizationId=
- GET /monitoring/latency/alerts
- GET /monitoring/latency/export
- GET /monitoring/latency/operations?organizationId=
- GET /monitoring/latency/trends?operation=&timeWindow=&granularity=minute|hour|day&organizationId=
- GET /monitoring/latency/percentiles?operation=&timeWindow=&organizationId=
- GET /monitoring/latency/dashboard?timeRange=1h|24h|7d|30d&organizationId=
- GET /monitoring/latency/health

Example stats:
```bash
curl -s 'http://localhost:3001/api/v1/monitoring/latency/stats?operation=createSubscription' \
  -H 'Authorization: Bearer $TOKEN'
```