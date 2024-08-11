const Inspection = require('../models/inspectiondb'); // Adjust the path as needed

// Create a new inspection
exports.createInspection = async (req, res) => {
  try {
    const inspection = new Inspection(req.body);
    await inspection.save();
    res.status(201).json(inspection);
  } catch (error) {
    console.error('Error creating inspection:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all inspections
exports.getAllInspections = async (req, res) => {
  try {
    const inspections = await Inspection.find();
    res.status(200).json(inspections);
  } catch (error) {
    console.error('Error fetching inspections:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get an inspection by ID
exports.getInspectionById = async (req, res) => {
  try {
    const inspection = await Inspection.findById(req.params.id);
    if (!inspection) {
      return res.status(404).json({ message: 'Inspection not found' });
    }
    res.status(200).json(inspection);
  } catch (error) {
    console.error('Error fetching inspection:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update an inspection
exports.updateInspection = async (req, res) => {
  try {
    const inspection = await Inspection.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!inspection) {
      return res.status(404).json({ message: 'Inspection not found' });
    }
    res.status(200).json(inspection);
  } catch (error) {
    console.error('Error updating inspection:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete an inspection
exports.deleteInspection = async (req, res) => {
  try {
    const inspection = await Inspection.findByIdAndDelete(req.params.id);
    if (!inspection) {
      return res.status(404).json({ message: 'Inspection not found' });
    }
    res.status(200).json({ message: 'Inspection deleted' });
  } catch (error) {
    console.error('Error deleting inspection:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
