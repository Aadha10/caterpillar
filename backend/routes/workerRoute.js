const express = require('express');
const router = express.Router();
const workerController = require('../controllers/workerController');
const authController = require('../controllers/authController');
const Worker = require('../models/workersdb');

router.post('/login',authController.login);

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const worker = await Worker.findOne({ email, password }); // You should hash passwords in production
  
      if (!worker) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      // Respond with role and employeeid
      res.json({ employeeid: worker.employeeid, role: worker.role });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
// Route to get all workers
router.get('/', workerController.getAllWorkers);

// Route to get a single worker by ID
router.get('/:id', workerController.getWorkerById);

// Route to create a new worker
router.post('/', workerController.createWorker);

// Route to update a worker by ID
router.put('/:id', workerController.updateWorker);

// Route to delete a worker by ID
router.delete('/:id', workerController.deleteWorker);

module.exports = router;
