import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold text-center py-8">
          Welcome to Trigo dispatcher-app
        </h1>
      </div>
      <ToastContainer />
    </Router>
  );
}

export default App;
