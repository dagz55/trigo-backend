# TriGo - Community Tricycle Rides

TriGo is a mobile-first web application that connects passengers with trusted tricycle drivers in local communities, providing safe, affordable, and convenient transportation.

## Features

- Real-time ride booking and tracking
- Separate interfaces for passengers and drivers
- Community-focused routes and pricing
- Secure in-app payment integration
- Rating system for drivers and passengers
- Admin dashboard for community management
- Firebase Authentication with email/password, Google, and Facebook sign-in options
- Docker containerization for separate passenger, driver, and dispatcher interfaces

## Getting Started

### Prerequisites

- Node.js 14.x or later
- npm 6.x or later
- Firebase account
- Docker and Docker Compose (for containerized deployment)

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/trigo-app.git
   cd trigo-app
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables:
   Create a `.env.local` file with the following variables:
   \`\`\`
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   
   # For containerized deployment
   CONTAINER_TYPE=passenger|driver|dispatcher
   NEXT_PUBLIC_CONTAINER_TYPE=passenger|driver|dispatcher
   \`\`\`

4. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Docker Containerization

TriGo is designed to run as three separate containers:

- **Passenger Container**: For ride booking and passenger features
- **Driver Container**: For driver-specific features
- **Dispatcher Container**: For community dispatchers to manage rides

### Running with Docker

1. Build and start all containers:
   \`\`\`bash
   npm run docker:build
   npm run docker:start
   \`\`\`
   
   Or use the provided script:
   \`\`\`bash
   chmod +x start-containers.sh
   ./start-containers.sh
   \`\`\`

2. Access the different interfaces:
   - Passenger: [http://localhost:3000](http://localhost:3000)
   - Driver: [http://localhost:3001](http://localhost:3001)
   - Dispatcher: [http://localhost:3002](http://localhost:3002)

3. Stop the containers:
   \`\`\`bash
   npm run docker:stop
   \`\`\`

### Docker Commands

\`\`\`bash
# Build all containers
npm run docker:build

# Start all containers
npm run docker:start

# View logs
npm run docker:logs

# Restart containers
npm run docker:restart

# Stop containers
npm run docker:stop
\`\`\`

## Deployment

### Vercel Deployment

1. Set up the required environment variables in your Vercel project settings.
2. Deploy the application:
   \`\`\`bash
   vercel
   \`\`\`

### Docker Deployment

For production deployment with Docker:

1. Update the `docker-compose.yml` file with production settings.
2. Deploy to your hosting environment that supports Docker containers.
3. Ensure environment variables are properly set in your production environment.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

