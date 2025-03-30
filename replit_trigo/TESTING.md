# TriGo Testing & Demo Documentation

This document outlines the testing procedures and live demonstration checklist for the TriGo application.

## Test Environment Setup

### Prerequisites
- Running PostgreSQL instance with schema applied
- Test data loaded (TODA, drivers, passengers, dispatcher, admin)
- All services running locally or in test environment
- Test accounts for each user role

### Test Accounts
Use the following accounts created in the test-seed-data.sql:

| Role | Email | Name |
|------|-------|------|
| Admin | cecilia.morales@gmail.com | Cecilia Morales |
| Dispatcher | ferdinand.gonzales@gmail.com | Ferdinand Gonzales |
| Trider | manuel.reyes@gmail.com | Manuel Reyes |
| Passenger | maria.santos@gmail.com | Maria Santos |

## Testing Checklist by Role

### Passenger Testing
- [ ] Anonymous booking flow
  - [ ] Enter pickup location
  - [ ] Enter destination
  - [ ] View fare estimate
  - [ ] Confirm booking
- [ ] Account registration
- [ ] Login functionality
- [ ] Profile management
- [ ] Ride history viewing
- [ ] Real-time location tracking
- [ ] Rating driver after trip
- [ ] Cancellation process

### Trider (Driver) Testing
- [ ] Login flow
- [ ] Profile and vehicle information management
- [ ] Status toggle (online/offline)
- [ ] Ride request acceptance
- [ ] Navigation to pickup point
- [ ] Trip start process
- [ ] Navigation to destination
- [ ] Trip completion process
- [ ] Earnings report viewing
- [ ] Daily and weekly statistics

### Dispatcher Testing
- [ ] Login flow
- [ ] Dashboard overview
- [ ] Active drivers monitoring
- [ ] Manual trip assignment
- [ ] Trip status monitoring
- [ ] Issue resolution tools
- [ ] Daily summary reports
- [ ] Managing TODA-specific settings

### Admin Testing
- [ ] Login flow
- [ ] TODA management
  - [ ] Add new TODA
  - [ ] Edit TODA details
  - [ ] View TODA statistics
- [ ] Driver management
  - [ ] Approve new drivers
  - [ ] Suspend/unsuspend drivers
  - [ ] View driver details and history
- [ ] User management
  - [ ] Role assignment
  - [ ] Account status management
- [ ] System configuration

## Integration Testing

- [ ] Location Services
  - [ ] Address autocomplete
  - [ ] Geocoding functionality
  - [ ] Map display and rendering
  - [ ] Route calculation
  - [ ] ETA estimation
- [ ] Real-time Updates
  - [ ] Driver location updates
  - [ ] Trip status changes
  - [ ] Notifications
- [ ] Database Operations
  - [ ] High-volume read/write operations
  - [ ] Transaction integrity

## Live Demo Walkthrough

### Pre-Demo Setup
1. Ensure all test accounts are logged out
2. Reset all demonstration devices to known state
3. Prepare demonstration script with talking points
4. Have backup devices ready in case of technical issues

### Demo Flow

#### 1. Introduction (5 minutes)
- Present landing page
- Explain TriGo's purpose and target market
- Highlight key differentiators

#### 2. Passenger Experience (10 minutes)
- Show anonymous booking process
- Demonstrate passenger sign-up
- Show ride history and profile settings
- Demonstrate real-time tracking

#### 3. Trider Experience (10 minutes)
- Show trider login and dashboard
- Demonstrate receiving and accepting a ride
- Navigate through a simulated pickup and dropoff
- Show earnings and statistics

#### 4. Dispatcher Panel (5 minutes)
- Show current active vehicles and status
- Demonstrate manual dispatch functionality
- Show issue resolution process

#### 5. Admin Functions (5 minutes)
- Demonstrate TODA management
- Show user management capabilities
- Present analytics dashboard

#### 6. Closing Demonstration (5 minutes)
- Show multiple concurrent activities
- Demonstrate system responsiveness
- Highlight security features

## Common Test Scenarios

### Happy Path Scenario
1. Passenger books a trip
2. Nearby trider accepts the booking
3. Trider navigates to pickup point
4. Passenger is picked up
5. Trip completes at destination
6. Both parties rate the experience

### Edge Cases
- [ ] No drivers available in area
- [ ] Driver cancellation mid-trip
- [ ] Passenger cancellation
- [ ] App disconnection during trip
- [ ] Invalid locations or routes
- [ ] High demand/surge situations

## Performance Testing Metrics
- Average response time: < 2 seconds
- Trip matching time: < 30 seconds
- Location update frequency: every 5 seconds
- Concurrent user capacity: 100+ users per TODA

## Bug Reporting

When reporting bugs during testing, include:
1. User role and account used
2. Step-by-step reproduction steps
3. Expected vs. actual behavior
4. Screenshots/recordings
5. Device and browser information
6. Severity assessment

---

**Note:** This testing documentation is a living document. Update it as new features are added or existing ones are modified. 