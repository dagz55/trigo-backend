# TriGo Application Running Guide

This guide provides step-by-step instructions for setting up and running the TriGo application in different environments.

## Local Development Setup

### Prerequisites
- Node.js 18.x or later
- npm or pnpm (pnpm recommended)
- Docker (for PostgreSQL database)
- Google Maps API key

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/trigo.git
cd trigo
```

### Step 2: Install Dependencies
```bash
pnpm install
# or
npm install
```

### Step 3: Set Up Environment Variables
Create `.env.local` file in the project root:
```bash
cp .env.example .env.local
```

Edit `.env.local` to include your configuration:
```
# Google Maps API
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Database Connection
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/trigo

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 4: Set Up the Database
Start a PostgreSQL container:
```bash
docker run --name trigo-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=trigo -d -p 5432:5432 postgres:16
```

Apply the database schema:
```bash
docker exec -i trigo-postgres psql -U postgres -d trigo -f - < toda_schema.sql
```

Load test data (optional):
```bash
docker exec -i trigo-postgres psql -U postgres -d trigo -f - < test-seed-data.sql
```

### Step 5: Start the Development Server
```bash
pnpm dev
# or
npm run dev
```

The application will be available at http://localhost:3000

## Production Deployment

### Option 1: Vercel Deployment

1. Push your code to GitHub
2. Connect your repository in Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

### Option 2: Docker Deployment

1. Build the Docker image:
```bash
docker build -t trigo-app .
```

2. Run the container:
```bash
docker run -p 3000:3000 --env-file .env.production trigo-app
```

### Option 3: Replit Deployment

1. Import the repository to Replit
2. Configure environment variables in Replit Secrets
3. Press the Run button

## Running in Different Modes

### Development Mode
```bash
pnpm dev
```
Features:
- Hot module replacement
- Detailed error messages
- Development tools enabled

### Production Mode
```bash
pnpm build
pnpm start
```
Features:
- Optimized performance
- Minimized bundle size
- Production-ready

### Testing Mode
```bash
pnpm test
```
Runs the test suite for the application.

## Testing User Accounts

After running the application with test data, you can log in with the following accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | cecilia.morales@gmail.com | testpassword |
| Dispatcher | ferdinand.gonzales@gmail.com | testpassword |
| Trider | manuel.reyes@gmail.com | testpassword |
| Passenger | maria.santos@gmail.com | testpassword |

*Note: All test accounts use the password "testpassword"*

## Troubleshooting

### Database Connection Issues
- Verify your PostgreSQL container is running: `docker ps`
- Check the connection string in your `.env.local` file
- Ensure port 5432 is not used by another service

### Google Maps API Issues
- Confirm your API key has the necessary permissions
- Ensure the key is correctly set in `.env.local`
- Check browser console for API-related errors

### Next.js Build Errors
- Clear the `.next` directory: `rm -rf .next`
- Update dependencies: `pnpm update`
- Check for TypeScript errors: `pnpm lint`

## Infrastructure Requirements

For production deployment, recommended specifications:
- Database: PostgreSQL 13+
- Server: 2 CPU cores, 4GB RAM minimum
- Storage: 20GB minimum
- Network: SSL/TLS certificate for HTTPS 