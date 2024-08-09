import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './WorkerDashboard.css';

function WorkerDashboard() {
  const location = useLocation();
  const email = location.state?.email || '';
  const employeeid = location.state?.employeeid || ''; // Ensure employeeId is fetched

  const [formData, setFormData] = useState({
    truckSerialNumber: '',
    truckModel: '',
    inspectionId: '',
    inspectorName: '',
    inspectionEmployeeId: '',
    inspectionDate: '',
    location: '',
    geoCoordinates: '',
    serviceMeterHours: '',
    inspectorSignature: '',
    customerName: '',
    catCustomerId: '',
    tire: {
      leftFrontPressure: '',
      rightFrontPressure: '',
      leftFrontCondition: '',
      rightFrontCondition: '',
      leftRearPressure: '',
      rightRearPressure: '',
      leftRearCondition: '',
      rightRearCondition: '',
      overallSummary: '',
    },
    battery: {
      make: '',
      replacementDate: '',
      voltage: '',
      waterLevel: '',
      condition: '',
      leakOrRust: '',
      overallSummary: '',
    },
    exterior: {
      damage: '',
      oilLeak: '',
      overallSummary: '',
    },
    brakes: {
      fluidLevel: '',
      frontCondition: '',
      rearCondition: '',
      emergencyBrake: '',
      overallSummary: '',
    },
    engine: {
      damage: '',
      oilCondition: '',
      oilColor: '',
      brakeFluidCondition: '',
      brakeFluidColor: '',
      oilLeak: '',
      overallSummary: '',
    },
    customerFeedback: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    setFormData({
      truckSerialNumber: '',
      truckModel: '',
      inspectionId: '',
      inspectorName: '',
      inspectionEmployeeId: '',
      inspectionDate: '',
      location: '',
      geoCoordinates: '',
      serviceMeterHours: '',
      inspectorSignature: '',
      customerName: '',
      catCustomerId: '',
      tire: {
        leftFrontPressure: '',
        rightFrontPressure: '',
        leftFrontCondition: '',
        rightFrontCondition: '',
        leftRearPressure: '',
        rightRearPressure: '',
        leftRearCondition: '',
        rightRearCondition: '',
        overallSummary: '',
      },
      battery: {
        make: '',
        replacementDate: '',
        voltage: '',
        waterLevel: '',
        condition: '',
        leakOrRust: '',
        overallSummary: '',
      },
      exterior: {
        damage: '',
        oilLeak: '',
        overallSummary: '',
      },
      brakes: {
        fluidLevel: '',
        frontCondition: '',
        rearCondition: '',
        emergencyBrake: '',
        overallSummary: '',
      },
      engine: {
        damage: '',
        oilCondition: '',
        oilColor: '',
        brakeFluidCondition: '',
        brakeFluidColor: '',
        oilLeak: '',
        overallSummary: '',
      },
      customerFeedback: '',
    });
  };

  return (
    <div className="worker-dashboard">
      <h1>Truck Inspection Form</h1>
      <p>Logged in as: {email}</p> {/* Display email */}
      <p>Employee ID: {employeeid}</p> {/* Display employee ID */}
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>Header</h2>
          <input
            type="text"
            name="truckSerialNumber"
            value={formData.truckSerialNumber}
            onChange={handleChange}
            placeholder="Truck Serial Number"
          />
          <input
            type="text"
            name="truckModel"
            value={formData.truckModel}
            onChange={handleChange}
            placeholder="Truck Model"
          />
          <input
            type="text"
            name="inspectionId"
            value={formData.inspectionId}
            onChange={handleChange}
            placeholder="Inspection ID"
          />
          <input
            type="text"
            name="inspectorName"
            value={formData.inspectorName}
            onChange={handleChange}
            placeholder="Inspector Name"
          />
          <input
            type="text"
            name="inspectionEmployeeId"
            value={formData.inspectionEmployeeId}
            onChange={handleChange}
            placeholder="Inspection Employee ID"
          />
          <input
            type="datetime-local"
            name="inspectionDate"
            value={formData.inspectionDate}
            onChange={handleChange}
          />
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location of Inspection"
          />
          <input
            type="text"
            name="geoCoordinates"
            value={formData.geoCoordinates}
            onChange={handleChange}
            placeholder="Geo Coordinates"
          />
          <input
            type="text"
            name="serviceMeterHours"
            value={formData.serviceMeterHours}
            onChange={handleChange}
            placeholder="Service Meter Hours"
          />
          <input
            type="text"
            name="inspectorSignature"
            value={formData.inspectorSignature}
            onChange={handleChange}
            placeholder="Inspector Signature"
          />
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            placeholder="Customer Name/Company Name"
          />
          <input
            type="text"
            name="catCustomerId"
            value={formData.catCustomerId}
            onChange={handleChange}
            placeholder="CAT Customer ID"
          />
        </div>
        
        {/* Add similar sections for Tire, Battery, Exterior, Brakes, Engine, and Customer Feedback */}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default WorkerDashboard;
