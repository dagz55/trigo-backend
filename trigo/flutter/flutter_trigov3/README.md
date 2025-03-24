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
├── dispatcher-app/                # Dispatcher application
│   ├── Dockerfile
│   ├── package.json
│   ├── .env
│   ├── public/
│   └── src/
│       ├── components/
│       ├── App.js
│       └── index.js
│
└── supabase/                     # Local Supabase setup
    ├── init/                     # Database initialization scripts
    │   └── 01_schema.sql        # Schema and sample data
    ├── kong/                     # API Gateway configuration
    │   └── kong.yml             # Kong routes and plugins
    └── data/                     # Persistent database data
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
- **Backend**: Supabase with PostGIS
- **Containerization**: Docker
- **Cloud Deployment**: Google Cloud Run
- **CI/CD**: Google Cloud Build
- **Database**: PostgreSQL with PostGIS
- **API Gateway**: Kong
- **Authentication**: GoTrue
- **Realtime**: Supabase Realtime

## Docker Manager Script

A new Python script `docker_manager.py` has been added to manage Docker containers with the following features:

- **Start, Stop, and Restart Containers**: Easily manage your Docker containers.
- **Error Handling**: Robust error handling for Docker operations.
- **Logging**: Logs all actions and errors to `docker_manager.log`.
- **PDF Reporting**: Generates daily status reports in PDF format.

### Using the Docker Manager Script

1. **Setup**:
   - Ensure you have Python installed.
   - Create a virtual environment and activate it:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```
   - Install the required packages:
     ```bash
     pip install docker fpdf
     ```

2. **Running the Script**:
   - Start containers:
     ```bash
     python docker_manager.py
     ```
   - Follow the prompts to start, stop, or restart containers.

### Technologies Used

- **Frontend**: React.js
- **Containerization**: Docker
- **Cloud Deployment**: Google Cloud Run
- **CI/CD**: Google Cloud Build
- **Scripting**: Python for container management and PDF reporting

## Local Development Setup

### Prerequisites
- Node.js (v18 or higher)
- npm
- Docker
- Docker Compose
- Python 3

### Running Locally

1. Clone the repository:
```bash
git clone https://github.com/dagz55/trigo.git
cd trigo
```

2. Set up the Python environment:
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

3. Start the local Supabase instance:
```bash
docker-compose -f docker-compose.supabase.yml up -d
```

4. Start all application services:
```bash
docker-compose up --build
```

5. Access the applications:
- Passenger App: http://localhost:3000
- Driver App: http://localhost:3001
- Dispatcher App: http://localhost:3002
- Supabase Studio: http://localhost:3010
- API Gateway: http://localhost:8000

## Local Supabase Services

The local Supabase instance provides the following services:

### Database
- PostgreSQL with PostGIS for spatial queries
- Sample TODA data pre-loaded
- Spatial indexes for efficient location-based queries
- Automatic timestamp management
- Connection: localhost:5432

### API Endpoints
- REST API: http://localhost:8000/rest/v1
- Auth API: http://localhost:8000/auth/v1
- Realtime API: http://localhost:8000/realtime/v1

### Management Tools
- Supabase Studio: http://localhost:3010
  - Database management
  - API documentation
  - Table editor
  - SQL editor

### Authentication
- User registration and login
- JWT token management
- Role-based access control

## Database Schema

### TODA Table
```sql
CREATE TABLE public.todas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    area VARCHAR(255) NOT NULL,
    center_latitude DOUBLE PRECISION NOT NULL,
    center_longitude DOUBLE PRECISION NOT NULL,
    radius DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Drivers Table
```sql
CREATE TABLE public.drivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    toda_id UUID REFERENCES public.todas(id),
    status VARCHAR(50) DEFAULT 'offline',
    current_latitude DOUBLE PRECISION,
    current_longitude DOUBLE PRECISION,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Rides Table
```sql
CREATE TABLE public.rides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    passenger_id UUID NOT NULL,
    driver_id UUID REFERENCES public.drivers(id),
    pickup_latitude DOUBLE PRECISION NOT NULL,
    pickup_longitude DOUBLE PRECISION NOT NULL,
    dropoff_latitude DOUBLE PRECISION NOT NULL,
    dropoff_longitude DOUBLE PRECISION NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Cloud Deployment

### Google Cloud Run Deployment

1. Set up Google Cloud SDK and authenticate:
```bash
gcloud auth login
gcloud config set project gcr.io/core-shard-452900-q8
```

2. Build and deploy each application:

```bash
# Deploy main app
cd main-app
gcloud builds submit --config cloudbuild.yaml .
gcloud run deploy main-app \
  --image gcr.io/gcr.io/core-shard-452900-q8/main-app:latest \
  --platform managed \
  --region asia-southeast1 \
  --port 3000 \
  --project gcr.io/core-shard-452900-q8 \
  --allow-unauthenticated

# Deploy driver app
cd ../driver-app
gcloud builds submit --config cloudbuild.yaml .
gcloud run deploy driver-app \
  --image gcr.io/gcr.io/core-shard-452900-q8/driver-app:latest \
  --platform managed \
  --region asia-southeast1 \
  --port 3001 \
  --project gcr.io/core-shard-452900-q8 \
  --allow-unauthenticated

# Deploy dispatcher app
cd ../dispatcher-app
gcloud builds submit --config cloudbuild.yaml .
gcloud run deploy dispatcher-app \
  --image gcr.io/gcr.io/core-shard-452900-q8/dispatcher-app:latest \
  --platform managed \
  --region asia-southeast1 \
  --port 3002 \
  --project gcr.io/core-shard-452900-q8 \
  --allow-unauthenticated
```

3. Update environment variables with the Cloud Run service URLs.

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

## Firebase Setup and Location Data

### Firebase Configuration

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Set up Firestore in your project
3. Download your service account key from Project Settings > Service Accounts > Generate new private key
4. Save the downloaded JSON file as `serviceAccountKey.json` in the root directory of this project
5. Update the `databaseURL` in `utils/firebase-admin.js` with your project's Firebase URL

### Uploading Location Data

To populate your Firestore database with Philippine provinces and cities data, run:

```bash
node utils/upload-location-data.js
```

This will:
1. Create a 'provinces' collection with province documents
2. Create a 'cities' collection with city documents that reference their respective provinces

You can then use this data in the location selector components.

## Running the Applications

### Using Docker Compose

You can start all three applications (passenger, driver, and dispatcher) using Docker Compose:

```bash
# Run in the foreground with logs visible
npm run dev

# Run in detached mode (background)
npm run dev:detached
```

### Accessing the Applications

- Passenger App: http://localhost:3000
- Driver App: http://localhost:3001
- Dispatcher App: http://localhost:3002

### Stopping the Applications

```bash
# Stop all containers
docker-compose down
``` 