# TriGo Application Architecture

This document describes the architectural structure of the TriGo application, including system components, data flow, and integration points.

## System Architecture Overview

```
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│  Client Layer │     │ Services Layer │     │    Data Layer │
│  (Next.js UI) │────▶│  (API Routes)  │────▶│   (Supabase)  │
└───────────────┘     └───────────────┘     └───────────────┘
```

### 1. Client Layer (Frontend)

The TriGo application uses a Next.js frontend with React 19 and TypeScript. The UI is organized by user roles:

```
                 ┌───────────────────────┐
                 │     Landing Page      │
                 └───────────┬───────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼───────┐   ┌────────▼───────┐   ┌────────▼───────┐
│  Passenger    │   │     Trider     │   │   Dispatcher   │
│  Interface    │   │   Interface    │   │   Interface    │
└───────────────┘   └────────────────┘   └────────────────┘
                                                 │
                                        ┌────────▼───────┐
                                        │     Admin      │
                                        │   Interface    │
                                        └────────────────┘
```

#### Key Frontend Components:

- **Shared Components**: Navigation, authentication, maps integration
- **Passenger Components**: Booking form, ride tracker, history view
- **Trider Components**: Trip management, navigation, earnings dashboard
- **Dispatcher Components**: Fleet management, booking assignment, issue resolution
- **Admin Components**: TODA management, user management, system configuration

### 2. Services Layer (Backend)

TriGo uses Next.js API routes for backend functionality, organized into logical service areas:

```
┌──────────────────────────────────────────────────────────────┐
│                       API Routes                              │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ Auth     │  │ Booking  │  │ Location │  │ User     │      │
│  │ Service  │  │ Service  │  │ Service  │  │ Service  │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ Trip     │  │ TODA     │  │ Payment  │  │ Analytics│      │
│  │ Service  │  │ Service  │  │ Service  │  │ Service  │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

#### Service Descriptions:

- **Auth Service**: User authentication, role management
- **Booking Service**: Trip booking, fare calculation
- **Location Service**: Geolocation, address lookup, route planning
- **User Service**: User profile management
- **Trip Service**: Active trip management, status updates
- **TODA Service**: TODA data management, driver association
- **Payment Service**: Transaction processing (future)
- **Analytics Service**: Reporting and statistics

### 3. Data Layer (Database)

TriGo uses Supabase (PostgreSQL) for data storage, with the following schema structure:

```
┌─────────────┐       ┌────────────────────┐       ┌─────────────┐
│    toda     │◄─────►│  tricycle_driver   │◄─────►│  app_users  │
└─────────────┘       └────────────────────┘       └─────────────┘
                              │                           │
                              │                           │
                              ▼                           ▼
                      ┌─────────────┐             ┌─────────────┐
                      │    trips    │◄────────────│   bookings  │
                      └─────────────┘             └─────────────┘
```

#### Core Database Tables:

- **toda**: TODA association information
- **tricycle_driver**: Driver and vehicle details
- **app_users**: User accounts for all roles
- **bookings**: Ride booking information
- **trips**: Executed trip details and status

## Integration Architecture

```
┌────────────────────────────────────────────────────────────┐
│                     TriGo Application                       │
└───────────────┬────────────────────────────┬───────────────┘
                │                            │
    ┌───────────▼──────────┐      ┌─────────▼───────────┐
    │   Google Maps API    │      │     Supabase        │
    │                      │      │                     │
    │ - Geocoding          │      │ - Authentication    │
    │ - Directions         │      │ - Database          │
    │ - Distance Matrix    │      │ - Storage           │
    │ - Places             │      │ - Realtime          │
    └──────────────────────┘      └─────────────────────┘
```

### External API Integrations:

1. **Google Maps Platform**:
   - Geocoding API: Convert addresses to coordinates
   - Directions API: Calculate routes and distances
   - Maps JavaScript API: Display interactive maps
   - Places API: Location autocomplete

2. **Supabase Services**:
   - Auth: User authentication and management
   - Database: PostgreSQL storage
   - Storage: File storage for driver/vehicle documents
   - Realtime: Real-time location updates

## Deployment Architecture

```
                ┌─────────────┐
                │   Users     │
                └──────┬──────┘
                       │
                       ▼
┌─────────────────────────────────────────┐
│            Content Delivery             │
│              Network (CDN)              │
└─────────────────┬───────────────────────┘
                  │
        ┌─────────▼─────────┐
        │                   │
┌───────▼───────┐   ┌───────▼───────┐
│   Next.js     │   │   API         │
│   Frontend    │   │   Backend     │
└───────────────┘   └───────▲───────┘
                            │
                    ┌───────▼───────┐
                    │   Supabase    │
                    │   Platform    │
                    └───────────────┘
```

### Deployment Options:

1. **Vercel Deployment**:
   - Frontend and API routes deployed to Vercel's global edge network
   - Connected to Supabase cloud instance

2. **Docker Deployment**:
   - Containerized application deployment
   - Self-hosted or cloud provider (AWS, GCP, Azure)
   - Can use managed PostgreSQL or containerized database

3. **Replit Deployment**:
   - All-in-one development and hosting platform
   - Easy setup for demonstration and testing

## Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Security Layers                          │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │ Client-side │  │  API Layer  │  │  Data Layer │          │
│  │  Security   │  │  Security   │  │  Security   │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Security Implementation:

1. **Authentication**: 
   - JWT-based authentication with Supabase Auth
   - Role-based access control

2. **API Security**:
   - Input validation and sanitization
   - Rate limiting
   - CORS configuration

3. **Data Security**:
   - Row-level security in PostgreSQL
   - Encrypted sensitive data
   - Parameterized queries

## Scalability Architecture

For future growth, TriGo can scale horizontally using the following architecture:

```
                   ┌─────────────┐
                   │ Load Balancer │
                   └───────┬───────┘
                           │
      ┌──────────┬─────────┴────────┬──────────┐
      │          │                  │          │
┌─────▼─────┐┌───▼───┐        ┌─────▼────┐┌────▼────┐
│  App      ││  App  │   ...   │  App     ││  App    │
│  Server 1 ││Server 2│        │ Server N-1││Server N │
└─────┬─────┘└───┬───┘        └─────┬────┘└────┬────┘
      │          │                  │          │
      └──────────┴──────┬───────────┴──────────┘
                        │
                 ┌──────▼─────┐
                 │ Database   │
                 │ Cluster    │
                 └────────────┘
```

### Scaling Strategies:

1. **Frontend Scaling**:
   - Static site generation for landing pages
   - Incremental Static Regeneration for dynamic content
   - Global CDN distribution

2. **Backend Scaling**:
   - Horizontal scaling of API servers
   - Serverless function deployment
   - Microservice decomposition for high-traffic components

3. **Database Scaling**:
   - Read replicas for query-heavy operations
   - Connection pooling
   - Sharding for geographic distribution

## Development Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  Development Environment                     │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │ Local Next  │  │  Local DB   │  │  Mocked     │          │
│  │ Development │  │ (PostgreSQL)│  │  Services   │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Development Tools:

1. **Next.js Developer Environment**:
   - Hot module replacement
   - TypeScript type checking
   - ESLint and Prettier integration

2. **Local Database**:
   - PostgreSQL in Docker container
   - Supabase Local Development

3. **Testing Infrastructure**:
   - Jest for unit testing
   - Cypress for end-to-end testing
   - Mock service workers for API simulation

---

*Note: The textual diagrams in this document are simplified representations. For interactive diagrams, please refer to the referenced diagram files in the documentation repository.* 