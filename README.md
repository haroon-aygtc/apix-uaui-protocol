# 🚀 APIX-UAUI Protocol Platform

**Enterprise-Grade Authentication & RBAC System with Multi-Tenant Architecture**

[![Production Ready](https://img.shields.io/badge/Production-Ready-green.svg)](https://github.com/haroon-aygtc/apix-uaui-protocol)
[![Security](https://img.shields.io/badge/Security-Enterprise%20Grade-blue.svg)](https://github.com/haroon-aygtc/apix-uaui-protocol)
[![Multi-Tenant](https://img.shields.io/badge/Multi--Tenant-Supported-orange.svg)](https://github.com/haroon-aygtc/apix-uaui-protocol)

## 🎯 **Overview**

The APIX-UAUI Protocol Platform is a production-ready, enterprise-grade authentication and role-based access control (RBAC) system built with modern technologies and security best practices.

### **🔐 Key Features**

- **Enterprise Authentication** - Real bcrypt password hashing, JWT tokens, account lockout protection
- **Complete RBAC System** - 4-level role hierarchy with fine-grained permissions
- **Multi-Tenant Architecture** - Organization-scoped isolation and cross-tenant protection
- **Production Security** - Rate limiting, audit logging, comprehensive security measures
- **Real-Time Support** - WebSocket authentication and tenant-aware connections
- **API-First Design** - RESTful APIs with OpenAPI documentation

## 🏗️ **Architecture**

### **Technology Stack**
- **Backend:** Node.js, NestJS, TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Cache:** Redis for sessions and caching
- **Authentication:** JWT with refresh tokens
- **Security:** bcrypt, rate limiting, audit logging

### **Project Structure**
```
apix-platform/
├── apps/
│   └── api/                    # Main API application
│       ├── src/
│       │   ├── modules/
│       │   │   ├── auth/       # Authentication system
│       │   │   ├── rbac/       # Role-based access control
│       │   │   └── ...         # Other modules
│       │   ├── common/         # Shared utilities and guards
│       │   └── prisma/         # Database schema
│       ├── scripts/            # Deployment and utility scripts
│       └── test/              # Integration tests
└── docs/                      # Documentation (not in repo)
```

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+
- PostgreSQL 13+
- Redis 6+
- npm or yarn

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/haroon-aygtc/apix-uaui-protocol.git
   cd apix-uaui-protocol
   ```

2. **Install dependencies**
   ```bash
   cd apix-platform/apps/api
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Update database and Redis connection strings
   ```

4. **Generate production secrets**
   ```bash
   npm run generate:secrets
   ```

5. **Setup database**
   ```bash
   npm run db:push
   ```

6. **Start the application**
   ```bash
   npm run start:dev
   ```

### **🎯 Verified Working Features**
- ✅ **User Registration & Login** - Real bcrypt password hashing
- ✅ **JWT Authentication** - Access/refresh tokens with organization context
- ✅ **Protected Routes** - Proper authorization and tenant isolation
- ✅ **Multi-Tenant Support** - Organization-scoped data isolation
- ✅ **Database Schema** - Enhanced with security and RBAC tables
- ✅ **Production Deployment** - Automated setup and configuration tools

## 🔐 **Authentication Features**

### **Password Security**
- bcrypt hashing with 12 salt rounds
- Account lockout after failed attempts
- Password reset functionality
- Email verification support

### **JWT Implementation**
- Access and refresh tokens
- Organization-scoped claims
- Configurable expiration
- Secure token validation

### **Multi-Tenant Support**
- Organization isolation
- Cross-tenant access prevention
- Tenant-aware API endpoints
- Shared infrastructure

## 🛡️ **RBAC System**

### **Role Hierarchy**
- **SUPER_ADMIN** - Full system access
- **ORG_ADMIN** - Organization management
- **DEVELOPER** - Development access
- **VIEWER** - Read-only access

### **Permission System**
- 35+ granular permissions
- Wildcard permission support
- Resource-level access control
- Dynamic permission checking

## 📚 **API Documentation**

### **Authentication Endpoints**
```
POST /api/v1/auth/register    # User registration
POST /api/v1/auth/login       # User login
POST /api/v1/auth/refresh     # Token refresh
GET  /api/v1/auth/profile     # User profile
```

### **RBAC Endpoints**
```
GET    /api/v1/rbac/roles           # List roles
POST   /api/v1/rbac/roles           # Create role
PUT    /api/v1/rbac/roles/:id       # Update role
DELETE /api/v1/rbac/roles/:id       # Delete role
POST   /api/v1/rbac/users/:id/roles # Assign role
```

## 🧪 **Testing**

### **Run Tests**
```bash
# Authentication system tests
npm run test:auth

# Integration tests
npm test

# Test coverage
npm run test:cov
```

### **Test Results**
- ✅ Authentication system: 100% functional
- ✅ Password security: Real bcrypt implementation
- ✅ JWT tokens: Working with multi-tenant support
- ✅ Protected routes: Proper authorization
- ✅ Multi-tenant isolation: Cross-tenant protection

## 🚀 **Production Deployment**

### **Automated Setup**
```bash
npm run setup:production
```

### **Manual Deployment**
1. Generate production secrets
2. Configure environment variables
3. Update database schema
4. Build application
5. Start production server

### **Environment Variables**
```env
DATABASE_URL=postgresql://...
REDIS_HOST=localhost
JWT_SECRET=your-secret-key
CORS_ORIGIN=https://your-domain.com
```

## 📊 **Security Features**

- **Password Protection** - bcrypt hashing, account lockout
- **JWT Security** - Secure tokens with proper validation
- **Rate Limiting** - API and authentication rate limits
- **Audit Logging** - Comprehensive security event logging
- **CORS Protection** - Configurable cross-origin policies
- **Input Validation** - Comprehensive request validation

## 🔧 **Development**

### **Available Scripts**
```bash
npm run start:dev          # Development server
npm run build              # Build application
npm run test               # Run tests
npm run generate:secrets   # Generate secure secrets
npm run db:push           # Update database schema
```

### **Code Quality**
- TypeScript strict mode
- ESLint and Prettier
- Comprehensive error handling
- Input validation with DTOs
- Production-ready code only

## 📈 **Performance**

- **Database** - Connection pooling and optimized queries
- **Caching** - Redis-based session and data caching
- **Clustering** - PM2 process management support
- **Monitoring** - Health checks and metrics endpoints

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 **Support**

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the test examples

## 🎯 **Roadmap**

- [ ] OAuth 2.0 / SAML SSO integration
- [ ] Multi-factor authentication
- [ ] Advanced audit reporting
- [ ] API key management
- [ ] Advanced rate limiting

---

**Built with ❤️ for enterprise-grade security and scalability**
