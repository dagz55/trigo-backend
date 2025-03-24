main-app/
├── Dockerfile
├── package.json
├── .env
├── public/
│   └── index.html
└── src/
    ├── index.js
    ├── App.js
    ├── firebase.js           # Firestore initialization
    └── components/
        ├── LandingPage.js    # Includes login/signup and routing
        ├── Login.js          # Login component with error handling
        ├── Signup.js         # Signup component with error handling
        ├── Dashboard.js      # Loads user profile, map, and redirects based on role
        ├── Navbar.js         # Always-visible navigation with Home button
        └── MapComponent.js   # Loads map data from an API with error handling