import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Dashboard.css';
import Admin from './Admin';
import AddCustomer from './AddCustomer'; // Import AddCustomer component

function Dashboard() {
  const [view, setView] = useState('overview');
  const [employees, setEmployees] = useState(2000);
  const [dealers, setDealers] = useState(100);
  const [serviceMen, setServiceMen] = useState(500);
  const navigate = useNavigate(); // Initialize navigate for redirection

  const handleClick = (viewName) => {
    setView(viewName);
  };

  const handleLogout = () => {
    // Add any logout logic here (e.g., clearing user session or token)
    navigate('/'); // Redirect to home page
  };

  // Function to calculate stroke dasharray for the SVG circle based on value
  const getStrokeDasharray = (value, maxValue) => {
    const radius = 80; // Radius of the circle
    const circumference = 2 * Math.PI * radius;
    const percentage = (value / maxValue) * 100;
    return `${(percentage / 100) * circumference} ${circumference}`;
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h3>Admin Dashboard</h3>
        <button className="sidebar-btn" onClick={() => handleClick('overview')}>Employee Details</button>
        <button className="sidebar-btn" onClick={() => handleClick('newEmployee')}>New Employee</button>
        <button className="sidebar-btn" onClick={() => handleClick('addCustomer')}>Add Customer</button> {/* Added button for Add Customer */}
        <button className="sidebar-btn" onClick={handleLogout}>Logout</button> {/* Added logout handler */}
      </div>
      <div className="main-content">
        {view === 'overview' && (
          <>
            <h2>Overview</h2>
            <div className="progress-meters">
              <div className="progress-meter">
                <svg className="progress-ring" width="200" height="200">
                  <circle
                    className="progress-ring__circle"
                    stroke="#e0e0e0"
                    strokeWidth="20"
                    fill="transparent"
                    r="80"
                    cx="100"
                    cy="100"
                  />
                  <circle
                    className="progress-ring_circle progress-ring_circle--filled"
                    stroke="url(#grad1)"
                    strokeWidth="20"
                    fill="transparent"
                    r="80"
                    cx="100"
                    cy="100"
                    style={{
                      strokeDasharray: getStrokeDasharray(employees, 5000), // Update with maxValue
                      transition: 'stroke-dasharray 1s ease-out',
                    }}
                  />
                  <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#4caf50', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#81c784', stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>
                </svg>
                <p className="progress-text">{employees}</p>
                <p>Total Employees</p>
              </div>
              <div className="progress-meter">
                <svg className="progress-ring" width="200" height="200">
                  <circle
                    className="progress-ring__circle"
                    stroke="#e0e0e0"
                    strokeWidth="20"
                    fill="transparent"
                    r="80"
                    cx="100"
                    cy="100"
                  />
                  <circle
                    className="progress-ring_circle progress-ring_circle--filled"
                    stroke="url(#grad2)"
                    strokeWidth="20"
                    fill="transparent"
                    r="80"
                    cx="100"
                    cy="100"
                    style={{
                      strokeDasharray: getStrokeDasharray(dealers, 500), // Update with maxValue
                      transition: 'stroke-dasharray 1s ease-out',
                    }}
                  />
                  <defs>
                    <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#2196f3', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#64b5f6', stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>
                </svg>
                <p className="progress-text">{dealers}</p>
                <p>Total Dealers</p>
              </div>
              <div className="progress-meter">
                <svg className="progress-ring" width="200" height="200">
                  <circle
                    className="progress-ring__circle"
                    stroke="#e0e0e0"
                    strokeWidth="20"
                    fill="transparent"
                    r="80"
                    cx="100"
                    cy="100"
                  />
                  <circle
                    className="progress-ring_circle progress-ring_circle--filled"
                    stroke="url(#grad3)"
                    strokeWidth="20"
                    fill="transparent"
                    r="80"
                    cx="100"
                    cy="100"
                    style={{
                      strokeDasharray: getStrokeDasharray(serviceMen, 1000), // Update with maxValue
                      transition: 'stroke-dasharray 1s ease-out',
                    }}
                  />
                  <defs>
                    <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#ff9800', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#ffc107', stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>
                </svg>
                <p className="progress-text">{serviceMen}</p>
                <p>Total Service Men</p>
              </div>
            </div>
          </>
        )}
        {view === 'newEmployee' && <Admin />}
        {view === 'addCustomer' && <AddCustomer />} {/* Conditionally render AddCustomer component */}
      </div>
    </div>
  );
}

export default Dashboard;
