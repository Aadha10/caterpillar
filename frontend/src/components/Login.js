import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:4000/api/workers/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data);

      if (response.status === 200) {
        if (data.role === 'admin') {
          navigate('/admin/dashboard', { state: { email, employeeid: data.employeeid } });
        } else if (data.role === 'worker') {
          navigate('/scan', { state: { email, employeeid: data.employeeid } });
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-image">
        <img src="/images/bigtruckcat.png" alt="Caterpillar Truck" />
      </div>
      <div className="login-form-container">
        <form className="login-form" onSubmit={handleLogin}>
          <img src='/images/catlogo.png' alt="CAT Logo" className="logo" />
          <h2>Caterpillar Services</h2>
          <p>Please enter your details</p>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">Log In</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
}

export default Login;
