import React, { useState } from 'react';

function Worker() {
  const [section, setSection] = useState('Tires');
  const [response, setResponse] = useState('');
  const [log, setLog] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ section }),
      });
      const data = await res.json();
      setResponse(data.response);
      setLog([...log, { section, response: data.response }]);
    } catch (error) {
      console.error("Error connecting to the API:", error);
    }
  };

  return (
    <div className="App">
      <h1>Vehicle Inspection</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Section:
          <select value={section} onChange={(e) => setSection(e.target.value)}>
            <option value="Tires">Tires</option>
            <option value="Battery">Battery</option>
            <option value="Exterior">Exterior</option>
            <option value="Brakes">Brakes</option>
            <option value="Engine">Engine</option>
            <option value="Voice of Customer">Voice of Customer</option>
          </select>
        </label>
        <button type="submit">Start Inspection</button>
      </form>
      {response && (
        <div>
          <h2>Response:</h2>
          <p>{response}</p>
        </div>
      )}
      <div>
        <h2>Inspection Log:</h2>
        <ul>
          {log.map((entry, index) => (
            <li key={index}>
              <strong>{entry.section}</strong>: {entry.response}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Worker;