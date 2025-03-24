#!/bin/bash

# Function to create React app structure
create_app() {
    local app_name=$1
    local port=$2
    
    # Create app directory
    mkdir -p $app_name/src
    
    # Create package.json
    cat > $app_name/package.json << EOF
{
  "name": "trigo-${app_name}",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.3",
    "react-scripts": "5.0.1",
    "firebase": "^10.8.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^4.9.5",
    "react-toastify": "^9.1.3",
    "tailwindcss": "^3.4.1",
    "postcss": "^8.4.35",
    "autoprefixer": "^10.4.18"
  },
  "scripts": {
    "start": "react-scripts start",
    "dev": "WATCHPACK_POLLING=true react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
EOF

    # Create index.html
    mkdir -p $app_name/public
    cat > $app_name/public/index.html << EOF
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Trigo ${app_name} application" />
    <title>Trigo - ${app_name}</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
EOF

    # Create index.tsx
    cat > $app_name/src/index.tsx << EOF
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOF

    # Create App.tsx
    cat > $app_name/src/App.tsx << EOF
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold text-center py-8">
          Welcome to Trigo ${app_name}
        </h1>
      </div>
      <ToastContainer />
    </Router>
  );
}

export default App;
EOF

    # Create index.css with Tailwind
    cat > $app_name/src/index.css << EOF
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF

    # Create tsconfig.json
    cat > $app_name/tsconfig.json << EOF
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
EOF

    # Create tailwind.config.js
    cat > $app_name/tailwind.config.js << EOF
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOF

    # Create postcss.config.js
    cat > $app_name/postcss.config.js << EOF
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

    echo "Created $app_name structure"
}

# Create each app
create_app "landing-app" 3000
create_app "main-app" 3001
create_app "rider-app" 3002
create_app "dispatcher-app" 3003

echo "All apps created successfully!" 