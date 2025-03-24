# Trigo Project Overview

GitHub repository at [github.com/dagz55/trigo](https://github.com/dagz55/trigo).

1. Project overview
2. Repository structure
3. Setup instructions for local development
4. Deployment instructions
5. Technologies used
6. Contact information

```markdown
# Trigo - Multi-App Ride Service Platform

A comprehensive ride service platform divided into three containerized applications serving different user types: passengers, drivers, and dispatchers.

## Project Structure

```
├── main-app/                      # Passenger application
│   ├── Dockerfile                 # Container configuration
│   ├── package.json               # Dependencies
│   ├── .env                       # Environment variables
│   ├── public/                    # Static files
│   └── src/                       # Application source code
│       ├── components/            # React components
│       ├── App.js                 # Main app component
│       └── index.js               # Entry point
│
├── driver-app/                    # Driver application
│   ├── Dockerfile
│   ├── package.json
│   ├── .env
│   ├── public/
│   └── src/
│       ├── components/
│       ├── App.js
│       └── index.js
│
└── dispatcher-app/                # Dispatcher application
    ├── Dockerfile
    ├── package.json
    ├── .env
    ├── public/
    └── src/
        ├── components/
        ├── App.js
        └── index.js
```

## Applications Overview

### Main App (Passenger)
- User registration and authentication
- Trip booking
- Ride history
- Payment management

### Driver App
- Driver profile management
- Ride acceptance/rejection
- Navigation
- Earnings tracking

### Dispatcher App
- Ride monitoring
- Driver assignment
- System administration
- Analytics dashboard

## Technologies Used

- **Frontend**: React.js
- **Containerization**: Docker
- **Cloud Deployment**: Google Cloud Run
- **CI/CD**: Google Cloud Build

## Local Development Setup

### Prerequisites
- Node.js (v18 or higher)
- npm
- Docker
- Docker Compose

### Running Locally

1. Clone the repository:

```bash
git clone https://github.com/dagz55/trigo.git
cd trigo
```

1. Start all services using Docker Compose:

```bash
docker-compose up --build
```

1. Access the applications:

- Passenger App: [http://localhost:3000](http://localhost:3000)
- Driver App: [http://localhost:3001](http://localhost:3001)
- Dispatcher App: [http://localhost:3002](http://localhost:3002)

## Cloud Deployment

### Google Cloud Run Deployment

1. Set up Google Cloud SDK and authenticate:

```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

1. Build and deploy each application:

```bash
# Deploy main app
cd main-app
gcloud builds submit --config cloudbuild.yaml .
gcloud run deploy main-app \
  --image gcr.io/YOUR_PROJECT_ID/main-app:latest \
  --platform managed \
  --region YOUR_REGION \
  --port 3000 \
  --project YOUR_PROJECT_ID \
  --allow-unauthenticated

# Deploy driver app
cd ../driver-app
gcloud builds submit --config cloudbuild.yaml .
gcloud run deploy driver-app \
  --image gcr.io/YOUR_PROJECT_ID/driver-app:latest \
  --platform managed \
  --region YOUR_REGION \
  --port 3001 \
  --project YOUR_PROJECT_ID \
  --allow-unauthenticated

# Deploy dispatcher app
cd ../dispatcher-app
gcloud builds submit --config cloudbuild.yaml .
gcloud run deploy dispatcher-app \
  --image gcr.io/YOUR_PROJECT_ID/dispatcher-app:latest \
  --platform managed \
  --region YOUR_REGION \
  --port 3002 \
  --project YOUR_PROJECT_ID \
  --allow-unauthenticated
```

1. Update environment variables with the Cloud Run service URLs.

## Configuration

Each application has its own `.env` file for environment-specific variables:

- `REACT_APP_API_URL`: API endpoint URL
- `REACT_APP_AUTH_URL`: Authentication service URL

## Future Enhancements

- Real-time ride tracking
- Payment gateway integration
- Driver rating system
- Push notifications
- Analytics dashboard

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Project Link: [https://github.com/dagz55/trigo](https://github.com/dagz55/trigo)
```
Now that we've created a comprehensive README.md file, let's upload the project to GitHub. Follow these steps to push your code to github.com/dagz55/trigo:

1. First, initialize a Git repository in your project folder (if not already done):

```bash
cd /Users/robertsuarez/trigo/flutter/flutter_trigov3
git init
```

2. Add all the files to staging:

```bash
git add .
```

3. Create the initial commit:

```bash
git commit -m "Initial commit: Multi-container ride service platform"
```

4. Add the GitHub repository as a remote:

```bash
git remote add origin https://github.com/dagz55/trigo.git
```

5. Push the code to the main branch:

```bash
git push -u origin main
```

If you need to authenticate, GitHub will prompt you for your credentials. You might want to set up an SSH key or use a personal access token for better security.

If the repository already exists but is empty, these commands will work well. If the repository already has content, you might need to pull first or force push (though force pushing can overwrite existing content, so be careful).

Additional Git commands that might be useful:

- Check repository status:

```bash
git status
```

- Check remote repositories:

```bash
git remote -v
```

- Create and switch to a new branch:

```bash
git checkout -b feature/new-feature
```

- Pull latest changes:

```bash
git pull origin main
```

The README.md provides comprehensive information about:

1. Project overview and structure
2. Description of each application (main-app, driver-app, dispatcher-app)
3. Technologies used
4. Local development instructions using Docker Compose
5. Cloud deployment instructions for Google Cloud Run
6. Configuration details
7. Future enhancement ideas
8. Contributing guidelines
9. License information
10. Contact details

This should give users and contributors a good understanding of the project and how to work with it.
