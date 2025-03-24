import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement login logic
    navigate('/dashboard');
  };

  return (
    <div className="auth-container">
      <h2>Welcome Back</h2>
      <p>Sign in to continue to TriGO</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '20px'}}>
          Login
        </button>
      </form>
      
      <div style={{marginTop: '20px', textAlign: 'center'}}>
        <p>Don't have an account? <Link to="/signup" style={{color: 'var(--primary-color)'}}>Sign Up</Link></p>
      </div>
    </div>
  );
}

export default Login;
