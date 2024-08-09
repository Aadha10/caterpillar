import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import WorkerDashboard from './components/WorkerDashboard';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/worker/dashboard" element={<WorkerDashboard />} />
            </Routes>
        </Router>
    );
}

export default App;
