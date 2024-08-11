import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './QRscanner.css'; // Import the CSS file

const QRscanner = () => {
    const [scannedText, setScannedText] = useState('');
    const [error, setError] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    
    // Retrieve email and employeeid from location state
    const email = location.state?.email || '';
    const employeeid = location.state?.employeeid || '';
    const customerid = location.state?.customerid || ''; // Retrieve customerid
    const truckserial = location.state?.truckserial || ''; // Retrieve truckserial

    const handleScan = async () => {
        try {
            // Correct HTTP method and URL
            const response = await axios.get('http://localhost:4000/scan');
            const qrCodeText = response.data.qr_code_text;

            setScannedText(qrCodeText);

            // Extract employeeId and email from the scanned text
            const lines = qrCodeText.split('\n');
            let empId = '';
            let mail = '';

            for (let line of lines) {
                if (line.startsWith('EmployeeID: ')) {
                    empId = line.replace('EmployeeID: ', '').trim();
                }
                if (line.startsWith('Email: ')) {
                    mail = line.replace('Email: ', '').trim();
                }
            }

            setError('');
        } catch (error) {
            setError('Error scanning QR code');
            console.error('Error:', error);
        }
    };

    const goToWorkerDashboard = () => {
        navigate('/worker/dashboard', { state: { customerid, truckserial, employeeid, email } });
    };

    const goToGestureRecognition = () => {
        navigate('/gesture-recognition', { state: { customerid, truckserial, employeeid, email } });
    };

    return (
        <div className="qrscanner-container">
            <button className="scan-button" onClick={handleScan}>Scan QR Code</button>
            <div className="info-container">
                {scannedText && (
                    <div className="info-section">
                        <h3>Scanned QR Code Text:</h3>
                        <pre>{scannedText}</pre>
                    </div>
                )}
                {employeeid && (
                    <div className="info-section">
                        <h3>Employee ID (from location):</h3>
                        <p>{employeeid}</p>
                    </div>
                )}
                {email && (
                    <div className="info-section">
                        <h3>Email (from location):</h3>
                        <p>{email}</p>
                    </div>
                )}
                {error && (
                    <div className="error">
                        <h3>Error:</h3>
                        <p>{error}</p>
                    </div>
                )}
                <div className="navigation-buttons">
                    <button className="nav-button" onClick={goToWorkerDashboard}>Go to Worker Dashboard</button>
                    <button className="nav-button" onClick={goToGestureRecognition}>Go to Gesture Recognition</button>
                </div>
            </div>
        </div>
    );
};

export default QRscanner;
