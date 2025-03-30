# TriGo Presentation Guide

This document provides a structured approach for presenting the TriGo application to different audiences, including technical and non-technical stakeholders.

## Presentation Preparation

### Required Materials
- Working TriGo application (local or deployed)
- Test accounts for all user roles
- Presentation slides (complementary)
- Technical documentation
- Internet-connected devices for demonstration

### Environment Setup
- Ensure all test data is properly loaded
- Position devices for easy transitions between roles
- Pre-login to accounts if needed for quick access
- Prepare backup screenshots/videos in case of technical issues

## Presentation Structure

### 1. Introduction (5 minutes)
- **Purpose**: Introduce TriGo and its mission
- **Key Points**:
  - Problem statement: Traditional tricycle hailing challenges
  - Solution overview: Digital platform for TODA management
  - Target audience: Tricycle associations, drivers, passengers
  - Value proposition: Efficiency, transparency, convenience

### 2. System Overview (5 minutes)
- **Purpose**: Provide high-level understanding of the application
- **Key Points**:
  - Architecture overview (simplified)
  - Role-based system explanation
  - Key features summary
  - Technology highlights (if technical audience)

### 3. Live Demonstration (30 minutes)
- **Purpose**: Show real functionality of the application
- **Sequence**:
  
  #### a. Passenger Experience (8 minutes)
  - Show landing page
  - Demonstrate anonymous booking
  - Demonstrate user registration
  - Show user login process
  - Demonstrate booking with account
  - Show ride history and receipts
  
  #### b. Trider Experience (8 minutes)
  - Show driver login process
  - Demonstrate availability management
  - Show incoming ride request
  - Demonstrate ride acceptance process
  - Show navigation and trip management
  - Demonstrate trip completion and earnings view
  
  #### c. Dispatcher Experience (7 minutes)
  - Show dispatcher dashboard
  - Demonstrate fleet monitoring
  - Show booking management interface
  - Demonstrate manual trip assignment
  - Show issue resolution process
  
  #### d. Admin Experience (7 minutes)
  - Show admin dashboard
  - Demonstrate TODA management
  - Show driver approval process
  - Demonstrate system configuration
  - Show analytics and reporting

### 4. Technical Deep Dive (Optional, 10 minutes)
- **Purpose**: Explain technical implementation for technical audiences
- **Key Points**:
  - Database schema and relationships
  - Authentication and security implementation
  - Google Maps integration details
  - Realtime data synchronization
  - Scalability considerations

### 5. Business Model & Implementation Strategy (5 minutes)
- **Purpose**: Explain monetization and rollout strategy
- **Key Points**:
  - Revenue model
  - Implementation timeline
  - Onboarding strategy for TODAs
  - Marketing approach
  - Growth projections

### 6. Q&A Session (5-15 minutes)
- **Purpose**: Address audience questions and concerns
- **Preparation**:
  - Anticipate common questions
  - Have technical team members available
  - Be prepared to show additional features if asked

## Presentation Tips

### For Technical Audiences
- Emphasize architecture decisions
- Discuss tech stack selection rationale
- Highlight scalability and security measures
- Be prepared to discuss code organization and quality
- Address technical challenges and solutions

### For Business Audiences
- Focus on value proposition and ROI
- Emphasize ease of implementation
- Highlight competitive advantages
- Discuss integration with existing systems
- Present clear metrics for success

### For TODA Stakeholders
- Emphasize benefits for drivers and operators
- Show simplicity of the interface
- Highlight transparency in booking and payment
- Discuss regulatory compliance
- Show TODA-specific management features

## Demonstration Script

Below is a detailed script for the live demonstration section:

### Passenger Demo Script

1. **Start at Landing Page**
   - "This is the TriGo landing page, where passengers can learn about the service and begin the booking process."

2. **Anonymous Booking**
   - "Let me show you how a passenger can book a ride without creating an account."
   - Click "Book a Ride" button
   - Enter pickup: "Talon Kuatro Public Market"
   - Enter destination: "SM Southmall"
   - "The system automatically calculates the fare based on distance and traffic conditions."
   - Show fare estimate and booking confirmation

3. **Registration/Login**
   - "For passengers who want to save their information and track ride history, we offer user accounts."
   - Demonstrate quick registration process
   - Show login with test account: maria.santos@gmail.com

4. **Logged-in Experience**
   - "Once logged in, passengers have access to additional features."
   - Show profile page with saved addresses
   - Navigate to booking history
   - Show receipt details and trip map

### Trider Demo Script

1. **Driver Login**
   - "Now let's switch to the driver's experience."
   - Login as manuel.reyes@gmail.com
   - "This is the trider dashboard, showing trip statistics and earnings."

2. **Availability Management**
   - "Drivers can easily set their availability status."
   - Toggle status to "Online"
   - "Now the driver is visible to the dispatcher and can receive booking requests."

3. **Trip Management**
   - "When a booking comes in, the driver receives a notification with trip details."
   - Show incoming booking notification
   - "Drivers can see pickup location, destination, and estimated fare before accepting."
   - Accept the booking
   - Show navigation to pickup point
   - "Once at the pickup point, the driver confirms passenger pickup."
   - Mark pickup complete
   - Show navigation to destination
   - "Upon arrival, the driver marks the trip as complete."
   - Complete the trip
   - Show trip summary and earnings update

### Dispatcher Demo Script

1. **Dispatcher Dashboard**
   - "The dispatcher role is crucial for managing the TODA fleet."
   - Login as ferdinand.gonzales@gmail.com
   - "This dashboard provides real-time visibility of all drivers and bookings."

2. **Fleet Management**
   - "Here we can see all active drivers on the map."
   - Show driver locations and status
   - Filter by availability status
   - "The dispatcher can monitor coverage areas and reposition drivers if needed."

3. **Booking Management**
   - "When the system can't automatically match a booking to a driver, the dispatcher steps in."
   - Show pending bookings queue
   - Select a booking
   - "The dispatcher can see all nearby available drivers."
   - Manually assign to a driver
   - "The system notifies the driver and updates the passenger."

4. **Issue Resolution**
   - "Dispatchers also handle customer service issues."
   - Show issue resolution interface
   - Demonstrate how to handle a cancellation request
   - "All actions are logged for transparency and quality control."

### Admin Demo Script

1. **Admin Dashboard**
   - "The admin role is for TODA management and system configuration."
   - Login as cecilia.morales@gmail.com
   - "This dashboard provides comprehensive oversight of the entire operation."

2. **TODA Management**
   - "Admins can manage TODA associations in the system."
   - Show TODA listing
   - Demonstrate adding/editing TODA details
   - "Each TODA can have its own service area and pricing parameters."

3. **Driver Management**
   - "Admins review and approve driver applications."
   - Show driver approval queue
   - Demonstrate document verification process
   - Approve a new driver
   - "The system maintains compliance with local transportation regulations."

4. **System Configuration**
   - "Admins can configure system-wide settings."
   - Show configuration panel
   - Demonstrate fare calculation adjustment
   - "These settings can be adjusted based on market conditions or regulatory requirements."

5. **Analytics**
   - "The admin dashboard includes powerful analytics."
   - Show key performance metrics
   - Demonstrate report generation
   - "These insights help optimize operations and identify growth opportunities."

## Post-Presentation Materials

Prepare the following materials to share after the presentation:

1. **Slide Deck**: PDF of presentation slides
2. **Documentation Links**: Access to technical and user documentation
3. **Demo Access**: Instructions for accessing a demo environment
4. **Contact Information**: Technical and business points of contact
5. **Implementation Guide**: Next steps for interested TODAs

---

**Note:** Customize this presentation guide based on the specific audience and time constraints. For shorter presentations, focus on the core user journeys (passenger and driver) and briefly summarize the management interfaces. 