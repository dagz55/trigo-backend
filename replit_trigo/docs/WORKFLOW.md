# TriGo Application Workflow

This document outlines the key workflows and processes within the TriGo application for all user roles.

## 1. Core Application Workflows

### 1.1 Passenger Booking Flow

```
Start → Enter Pickup & Destination → View Fare Estimate → Confirm Booking →
Wait for Driver → Track Driver Arrival → Take Trip → Complete Trip → Rate Experience → End
```

#### Detailed Steps:
1. **Booking Initiation**
   - Passenger opens app (logged in or anonymous)
   - Enters pickup location (map or text entry)
   - Enters destination

2. **Fare Estimation & Booking Confirmation**
   - System calculates estimated fare
   - Passenger reviews and confirms booking
   - System searches for available drivers

3. **Driver Assignment**
   - Nearby drivers receive booking notification
   - First driver to accept is assigned
   - If no drivers accept within timeframe, booking is escalated to dispatcher

4. **Trip Execution**
   - Passenger tracks driver on map
   - Driver arrives at pickup location
   - Driver confirms passenger pickup
   - Trip in progress with real-time tracking
   - Driver completes trip at destination

5. **Post-Trip Process**
   - Fare is finalized based on actual distance/time
   - Passenger receives trip receipt
   - Passenger rates driver (optional)

### 1.2 Trider (Driver) Workflow

```
Start → Go Online → Receive Booking Request → Accept/Decline → Navigate to Pickup →
Confirm Passenger Pickup → Navigate to Destination → Complete Trip → Receive Payment → End
```

#### Detailed Steps:
1. **Availability Management**
   - Driver logs into app
   - Sets status to "Online" (available for bookings)
   - Location tracking begins

2. **Booking Response**
   - Receives booking notification
   - Views pickup/destination details
   - Accepts or declines booking
   - If accepted, navigation begins

3. **Trip Execution**
   - Follows in-app navigation to pickup point
   - Confirms passenger pickup in app
   - Follows navigation to destination
   - Marks trip as completed upon arrival

4. **Post-Trip Process**
   - Reviews trip summary and earnings
   - Returns to available status for new bookings

### 1.3 Dispatcher Workflow

```
Start → Monitor Active Drivers → View Incoming Bookings → Assign Unmatched Bookings →
Monitor Ongoing Trips → Handle Issues → Generate Reports → End
```

#### Detailed Steps:
1. **Fleet Monitoring**
   - Views real-time map of driver locations
   - Monitors driver status (available, busy, offline)
   - Tracks coverage of service areas

2. **Booking Management**
   - Reviews all incoming bookings
   - Manually assigns bookings that weren't auto-matched
   - Prioritizes bookings based on wait time

3. **Trip Monitoring**
   - Tracks all ongoing trips
   - Monitors for delays or issues
   - Communicates with drivers when needed

4. **Issue Resolution**
   - Handles passenger complaints
   - Resolves driver-reported issues
   - Manages trip cancellations and adjustments

### 1.4 Admin Workflow

```
Start → Manage TODA Associations → Approve/Manage Drivers → Monitor System Performance → 
Configure System Settings → Generate Reports → End
```

#### Detailed Steps:
1. **TODA Management**
   - Registers new TODA associations
   - Updates TODA information and service areas
   - Manages TODA administrators

2. **Driver Management**
   - Reviews driver applications
   - Approves or rejects new drivers
   - Manages driver documentation and compliance

3. **System Configuration**
   - Sets fare calculation parameters
   - Configures booking rules
   - Manages notification settings

4. **Reporting and Analytics**
   - Generates operational reports
   - Analyzes performance metrics
   - Reviews user feedback

## 2. Integration Workflows

### 2.1 Location Services Flow

```
Start → Address Input → Geocoding → Map Display → Route Calculation → 
Distance/Time Estimation → Fare Calculation → End
```

### 2.2 Authentication Flow

```
Start → User Registration/Login → Role Assignment → Permission Validation → 
Access Appropriate Interface → Session Management → Logout → End
```

### 2.3 Payment Processing Flow (Future)

```
Start → Fare Calculation → Payment Method Selection → Transaction Processing → 
Receipt Generation → Payment Settlement → End
```

## 3. Common User Journeys

### 3.1 First-Time Passenger

1. Downloads and opens app
2. Creates account (optional)
3. Enters current location and destination
4. Reviews fare estimate
5. Confirms booking
6. Tracks driver on map
7. Takes trip
8. Receives receipt and rates experience

### 3.2 New Driver Onboarding

1. Registers as a driver
2. Submits vehicle and license information
3. Admin approves driver account
4. Driver logs in and sets availability
5. Receives first booking request
6. Completes first trip
7. Reviews earnings

### 3.3 Dispatcher Daily Operations

1. Logs in at shift start
2. Reviews active drivers and their locations
3. Monitors incoming bookings
4. Manually assigns bookings as needed
5. Handles customer issues
6. Generates end-of-day report

## 4. Error Handling Workflows

### 4.1 No Available Drivers

```
Booking Created → No Drivers Accept → System Retry → Dispatcher Notification → 
Manual Assignment or Passenger Notification → Booking Resolution
```

### 4.2 Trip Cancellation

```
Trip Scheduled → Cancellation Request → Cancellation Fee Assessment → 
Driver/Passenger Notification → Booking Status Update → Driver Returns to Available Pool
```

### 4.3 Location Tracking Issues

```
Tracking Error Detected → Fallback to SMS/Call → Manual Position Update → 
Trip Continuation → Issue Logging
```

## 5. Data Flow

### 5.1 Booking Data Flow

```
Passenger App → API Gateway → Booking Service → Driver Matching Service → 
Notification Service → Driver App → Trip Execution Service → Payment Service → 
Receipt Generation
```

### 5.2 Location Data Flow

```
Device GPS → Location Service → Real-time Database → Map Visualization → 
Route Calculation → ETA Prediction → User Interface
```

### 5.3 Analytics Data Flow

```
Trip Events → Event Processing → Data Warehouse → Analytics Engine → 
Reporting Dashboard → Business Intelligence
```

---

## Reference Diagrams

For visual representations of these workflows, refer to the following diagrams:

1. **User Journey Maps**: `docs/diagrams/user_journeys.pdf`
2. **Process Flow Diagrams**: `docs/diagrams/process_flows.pdf`
3. **System Integration Diagram**: `docs/diagrams/system_integration.pdf`
4. **Data Flow Diagram**: `docs/diagrams/data_flows.pdf`

*Note: The workflow descriptions in this document align with these diagrams.* 