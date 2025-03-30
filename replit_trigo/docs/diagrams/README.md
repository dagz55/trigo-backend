# TriGo Diagrams

This directory contains text-based diagrams representing the TriGo application architecture and workflows. In a complete implementation, these would be replaced with proper visual diagrams created with tools like Draw.io, Lucidchart, or similar diagramming software.

## Available Diagrams (Text-Based Versions)

### System Architecture

```
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│  Client Layer │     │ Services Layer │     │    Data Layer │
│  (Next.js UI) │────▶│  (API Routes)  │────▶│   (Supabase)  │
└───────────────┘     └───────────────┘     └───────────────┘
```

### User Journey Map

```
┌─────────┐     ┌─────────┐     ┌──────────┐     ┌──────────┐     ┌─────────┐
│ Download │────▶│ Sign Up │────▶│ Book Ride│────▶│ Take Trip│────▶│ Payment │
│   App    │     │(Optional│     │          │     │          │     │& Rating │
└─────────┘     └─────────┘     └──────────┘     └──────────┘     └─────────┘
```

### Database Entity Relationship Diagram

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

### Authentication Flow

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Login   │───▶│ Validate │───▶│  Create  │───▶│ Redirect │
│  Request │    │ Credentials│   │  Session │    │ to Role  │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
```

### Booking Process Flow

```
┌────────────┐   ┌────────────┐   ┌────────────┐   ┌────────────┐
│  Passenger │──▶│   System   │──▶│   Driver   │──▶│  Complete  │
│  Request   │   │  Matching  │   │ Assignment │   │    Trip    │
└────────────┘   └────────────┘   └────────────┘   └────────────┘
      │                                                  │
      │                                                  │
      │                                                  ▼
      │                                           ┌────────────┐
      └───────────────────────────────────────────┤   Payment  │
                                                  │    Flow    │
                                                  └────────────┘
```

### Component Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Components                          │
│                                                     │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐        │
│  │   Shared  │  │ Role-Based│  │  Feature  │        │
│  │Components │  │Components │  │ Components│        │
│  └───────────┘  └───────────┘  └───────────┘        │
│                                                     │
└─────────────────────────────────────────────────────┘

┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐
│   UI Components   │  │  Logic Components │  │   Data Components │
└───────────────────┘  └───────────────────┘  └───────────────────┘
```

### Deployment Workflow

```
┌───────────┐    ┌───────────┐    ┌───────────┐    ┌───────────┐
│   Source  │───▶│   Build   │───▶│  Deploy   │───▶│ Production│
│    Code   │    │  Process  │    │           │    │Environment│
└───────────┘    └───────────┘    └───────────┘    └───────────┘
```

## How to Generate Visual Diagrams

When implementing the TriGo application, it's recommended to create proper visual diagrams:

1. **Software Options**:
   - Draw.io (free, online or desktop)
   - Lucidchart
   - Microsoft Visio
   - PlantUML (for technical diagrams)

2. **Recommended Diagram Types**:
   - System Architecture Diagram
   - User Flow Diagrams
   - Entity Relationship Diagrams
   - Component Diagrams
   - Sequence Diagrams for key processes
   - Deployment Diagrams

3. **Best Practices**:
   - Use consistent styling
   - Include a legend when necessary
   - Maintain appropriate level of detail
   - Export in multiple formats (SVG, PNG, PDF)
   - Keep diagrams updated as the system evolves 