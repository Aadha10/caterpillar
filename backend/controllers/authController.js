const Worker = require('../models/workersdb');

exports.login = async (req, res) => {
    const { email, password } = req.body; // Ensure correct fields are used


    const adminUser = process.env.admin_user;
    const adminPass = process.env.admin_pass;

    if (email === adminUser && password === adminPass) {
        // Admin credentials are correct
        return res.status(200).json({ role: 'admin' });
    }

    try {
        const worker = await Worker.findOne({ email: email, password: password });
        if (worker) {
            // Worker credentials are correct
            return res.status(200).json({employeeid: worker.employeeid, role: 'worker' });
        } else {
            // Invalid credentials
            return res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (err) {
        return res.status(500).json({ message: 'Server error' });
    }
};
