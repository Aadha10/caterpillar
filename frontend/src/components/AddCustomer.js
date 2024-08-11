import React, { useState } from 'react';
import './AddCustomer.css'; // Create and style this as needed

function AddCustomer() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [contactno, setContactno] = useState('');
  const [truckserial, setTruckserial] = useState('');
  const [truckmodel, setTruckmodel] = useState('');
  const [customerid, setCustomerid] = useState(''); // Added customerid state

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          city,
          contactno: Number(contactno), // Ensure contact number is a number
          truckserial, // Ensure truck serial is a number
          truckmodel: Number(truckmodel), // Ensure truck model is a number
          customerid: Number(customerid) // Ensure customer ID is a number
        }),
      });

      const result = await response.json();
      if (response.ok) {
        console.log('Customer added:', result);
        // Clear the form fields
        setName('');
        setEmail('');
        setCity('');
        setContactno('');
        setTruckserial('');
        setTruckmodel('');
        setCustomerid(''); // Clear customer ID field
      } else {
        console.error('Error adding customer:', result.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="add-customer-container">
      <form className="add-customer-form" onSubmit={handleSubmit}>
        <h2>Add New Customer</h2>
        <div className="form-group">
          <label>Customer ID:</label>
          <input
            type="number"
            value={customerid}
            onChange={(e) => setCustomerid(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>City:</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Contact Number:</label>
          <input
            type="number"
            value={contactno}
            onChange={(e) => setContactno(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Truck Serial Number:</label>
          <input
            type="text"
            value={truckserial}
            onChange={(e) => setTruckserial(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Truck Model:</label>
          <input
            type="text"
            value={truckmodel}
            onChange={(e) => setTruckmodel(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Customer</button>
      </form>
    </div>
  );
}

export default AddCustomer;
