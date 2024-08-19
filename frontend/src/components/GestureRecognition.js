// src/components/GestureRecognition.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GestureRecognition = () => {
  const [gesture, setGesture] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch gesture data from the Flask endpoint
    const fetchGesture = async () => {
      try {
        const response = await axios.get('http://localhost:5000/gesture-recognition'); // Adjust URL as needed
        setGesture(response.data.gesture);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchGesture();
    const interval = setInterval(fetchGesture, 5000); // Fetch every 5 seconds

    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Gesture Recognition</h1>
      {gesture !== null ? (
        <p>Detected Gesture: {gesture}</p>
      ) : (
        <p>Loading gesture...</p>
      )}
    </div>
  );
};

export default GestureRecognition;
