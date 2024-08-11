import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Worker from './components/Worker';
import QRscanner from './components/QRscanner';
import GestureRecognition from './components/GestureRecognition'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/worker/dashboard" element={<Worker />} />
                <Route path="/scan" element={<QRscanner/>} />
                <Route path="/gesture-recognition" element={<GestureRecognition />} />
            </Routes>
        </Router>
    );
}

export default App;
