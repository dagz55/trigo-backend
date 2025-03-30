# TriGo Test Scenarios

This document outlines specific test scenarios to verify TriGo functionality across different user roles.

## Passenger Scenarios

### P1: Anonymous Booking
1. Open TriGo app without logging in
2. Enter pickup location: "Talon Kuatro Public Market"
3. Enter destination: "SM Southmall"
4. Verify fare estimate is displayed
5. Confirm booking
6. Expected: Booking is created and shown on dispatcher panel

### P2: Account Registration
1. Open the registration page
2. Enter valid name, email, password
3. Verify email verification process
4. Complete profile with phone number
5. Expected: User can log in with new credentials

### P3: Ride History
1. Log in as Maria Santos
2. Navigate to "Ride History"
3. Verify past rides are displayed with correct details
4. Open a specific ride receipt
5. Expected: Complete trip details shown with map visualization

### P4: Ride Cancellation
1. Book a ride as Maria Santos
2. Wait for driver assignment
3. Cancel ride before pickup
4. Expected: Ride is cancelled, notification sent to driver

## Trider Scenarios

### T1: Availability Toggle
1. Log in as Manuel Reyes
2. Navigate to Dashboard
3. Toggle availability status to "Online"
4. Verify status change is reflected in dispatcher panel
5. Expected: Driver is shown as available for trips

### T2: Trip Acceptance
1. Create a booking near Manuel's location
2. Verify trip request appears on Manuel's screen
3. Accept the trip
4. Expected: Trip status changes to "Accepted", navigation starts

### T3: Trip Completion
1. Start an accepted trip
2. Navigate to pickup point
3. Mark passenger as picked up
4. Navigate to destination
5. Mark trip as completed
6. Expected: Trip closes, fare is calculated, appears in earnings

### T4: Earnings Report
1. Complete multiple trips as Manuel Reyes
2. Navigate to "Earnings" section
3. Check daily, weekly, and monthly reports
4. Export report as CSV
5. Expected: Accurate earnings data displayed and exportable

## Dispatcher Scenarios

### D1: Active Fleet Monitoring
1. Log in as Ferdinand Gonzales
2. Navigate to "Fleet Management"
3. Verify all online drivers are displayed on map
4. Filter by specific area
5. Expected: Real-time driver locations visible with status indicators

### D2: Manual Trip Assignment
1. Create a booking request
2. Navigate to "Pending Trips"
3. Manually assign to Manuel Reyes
4. Expected: Trip assignment notification sent to driver

### D3: Trip Issue Resolution
1. Create a trip with reported issue
2. Navigate to "Issues" panel
3. Open the reported issue
4. Resolve using available tools
5. Add resolution notes
6. Expected: Issue marked as resolved, all parties notified

## Admin Scenarios

### A1: TODA Management
1. Log in as Cecilia Morales
2. Navigate to "TODA Management"
3. Add a new TODA association
4. Edit existing TODA details
5. View TODA statistics
6. Expected: Changes reflected immediately in system

### A2: Driver Approval
1. Create a new driver registration
2. Log in as admin
3. Navigate to "Driver Approvals"
4. Review driver documents
5. Approve the driver
6. Expected: Driver status changes to approved, can log in as trider

### A3: System Configuration
1. Navigate to "System Settings"
2. Modify fare calculation parameters
3. Update system notification settings
4. Save changes
5. Expected: New settings apply to all new transactions

## Integration Scenarios

### I1: Map Functionality
1. Enter various addresses and points of interest
2. Verify geocoding accuracy
3. Test route calculation between points
4. Check ETA calculations
5. Expected: Maps display correctly with accurate information

### I2: Real-time Updates
1. Create multiple simultaneous trips
2. Monitor location updates across devices
3. Verify update frequency meets requirements
4. Test under varying network conditions
5. Expected: Location updates propagate within 5 seconds

### I3: Database Performance
1. Generate 100+ simultaneous booking requests
2. Monitor database response time
3. Check for any deadlocks or bottlenecks
4. Verify data integrity after high volume
5. Expected: System handles load without performance degradation

## Edge Case Scenarios

### E1: No Available Drivers
1. Book a ride in area with no online drivers
2. Expected: System notifies user of no available drivers

### E2: Driver Cancellation
1. Have driver accept a trip
2. Driver cancels mid-trip
3. Expected: Passenger notified, trip re-queued for assignment

### E3: Network Disconnection
1. Start a trip with driver and passenger
2. Disconnect driver's internet connection
3. Reconnect after 2 minutes
4. Expected: Trip status and location properly sync after reconnection

---

## Test Data Requirements

Each test scenario requires specific test data in the database:

1. TODA association: "Talon Kuatro TODA"
2. Admin user: Cecilia Morales
3. Dispatcher: Ferdinand Gonzales
4. Triders: At least 5 active drivers
5. Passengers: At least 10 registered passengers
6. Trip history: Mixture of completed, cancelled, and in-progress trips

## Reporting

Use the following template for reporting test results:

```
Test ID: [ID]
Date: [Test Date]
Tester: [Name]
Status: [Pass/Fail/Blocked]

Steps Performed:
1. 
2.
3.

Expected Result:

Actual Result:

Issues Found:

Screenshots/Evidence:
``` 