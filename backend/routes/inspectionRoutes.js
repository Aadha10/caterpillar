const express = require('express');
const router = express.Router();
const inspectionController = require('../controllers/inspectionController'); // Adjust the path as needed

// Create a new inspection
router.post('/', inspectionController.createInspection);

// Get all inspections
router.get('/', inspectionController.getAllInspections);

// Get an inspection by ID
router.get('/:id', inspectionController.getInspectionById);

// Update an inspection
router.put('/:id', inspectionController.updateInspection);

// Delete an inspection
router.delete('/:id', inspectionController.deleteInspection);

module.exports = router;
