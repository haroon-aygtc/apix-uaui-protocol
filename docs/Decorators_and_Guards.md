### Tenant Isolation Decorators
- TenantIsolated(options): Apply tenant guard + metadata
  - options: { resource?, permission?, feature?, encryption?: boolean|string[], audit?: { action?, resourceType?, severity?, category? } }
  - Usage:
```ts
@TenantIsolated({ resource: 'Subscription', permission: 'subscription:create', audit: { action: 'CREATE', resourceType: 'Subscription' } })
@Post('subscriptions')
create(@OrganizationId() orgId: string, @UserId() userId: string) {}
```
- TenantWebSocketIsolated(options): Apply WebSocket guard with permission/feature/audit metadata

### Metadata decorators
- TenantResource(resource: string)
- RequirePermission(permission: string)
- RequireFeature(feature: string)
- RequireEncryption(fields?: string[])
- AuditLog(options)

### Param decorators
- TenantContext: extracts `request.tenantContext`
- OrganizationId: extracts org ID
- UserId: extracts user ID
- UserPermissions, UserRoles, TenantFeatures, TenantQuotas
- WebSocketTenantContext: extracts tenant context from socket

### Utility decorators
- ValidateTenantOwnership(resourceType: string): validates resource belongs to tenant (uses `tenantAwareService`)
- InjectOrganizationId(): injects `organizationId` into body/query
- EncryptSensitiveFields(fields: string[]): encrypts fields when tenant requires encryption
- TenantRateLimit({ maxRequests, windowMs, skipSuccessfulRequests? }): simple per-tenant rate limiting

### WebSocket guards/decorators
- TenantWebSocketGuard (class CanActivate): authenticates socket, validates tenant, joins rooms, enforces per-socket rate limits
- TenantWebSocketInterceptor (service): provides `authenticateConnection`, `validateMessage`, filtering helpers
- ValidateWebSocketMessage(): method decorator variant (two implementations exist; both validate context/rate limits and block invalid messages)
- TenantWebSocketRoom('org'|'user'|'role'|'feature'): ensures socket is in a tenant-specific room before handler runs

### Example WebSocket handler
```ts
@SubscribeMessage('publish')
@ValidateWebSocketMessage()
async handlePublish(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() data: any) {
  // ... publish logic
}
```