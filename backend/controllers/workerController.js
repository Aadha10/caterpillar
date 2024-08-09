const Worker = require('../models/workersdb');

// Controller to get all workers
exports.getAllWorkers = async (req, res) => {
    try {
        const workers = await Worker.find();
        res.status(200).json(workers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Controller to get a single worker by ID
exports.getWorkerById = async (req, res) => {
    try {
        const worker = await Worker.findById(req.params.id);
        if (!worker) {
            return res.status(404).json({ message: 'Worker not found' });
        }
        res.status(200).json(worker);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Controller to create a new worker
exports.createWorker = async (req, res) => {
    const { name, contactno, city, employeeid, email, password } = req.body;
    const worker = new Worker({
        name,
        contactno,
        city,
        employeeid,
        email,
        password,
        date: new Date()  // Set the current date
    });

    try {
        const newWorker = await worker.save();
        res.status(201).json(newWorker);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Controller to update a worker by ID
exports.updateWorker = async (req, res) => {
    try {
        const worker = await Worker.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!worker) {
            return res.status(404).json({ message: 'Worker not found' });
        }
        res.status(200).json(worker);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Controller to delete a worker by ID
exports.deleteWorker = async (req, res) => {
    try {
        const worker = await Worker.findByIdAndDelete(req.params.id);
        if (!worker) {
            return res.status(404).json({ message: 'Worker not found' });
        }
        res.status(200).json({ message: 'Worker deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
