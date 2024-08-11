const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();
const bodyParser = require("body-parser");
const Worker = require('./models/workersdb'); // Import Worker model
const app = express();
const { exec } = require('child_process');

app.use(cors({
  origin: 'http://localhost:3000'
}));

const mongoURI = process.env.Mongo;

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    socketTimeoutMS: 30000,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((error) =>
    console.error("MongoDB connection error:", error)
  );

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '500mb' }));

const workerRoutes = require('./routes/workerRoute');
app.use('/api/workers', workerRoutes);

// Example route to fetch worker details by employee ID
app.get('/api/workers/:employeeid', async (req, res) => {
    const { employeeid } = req.params;
  
    try {
      const worker = await Worker.findOne({ employeeid: employeeid }); // Ensure correct type
  
      if (!worker) {
        return res.status(404).json({ message: 'Worker not found' });
      }
  
      res.json(worker);
    } catch (error) {
      console.error('Error fetching worker details:', error); // Log detailed error
      res.status(500).json({ message: 'Server error' });
    }
});
   
const customerRoutes = require('./routes/customerRoutes');
app.use('/api/customers', customerRoutes);

const inspectionRoutes = require('./routes/inspectionRoutes');
// Use inspection routes
app.use('/api/inspections', inspectionRoutes);

app.get('/scan', (req, res) => {
  exec('python scanner.py', (error, stdout, stderr) => {
      if (error) {
          console.error(`exec error: ${error}`);
          res.status(500).json({ error: 'Failed to run scanner script' });
          return;
      }
      if (stderr) {
          console.error(`stderr: ${stderr}`);
          res.status(500).json({ error: 'Scanner script error' });
          return;
      }
      res.json({ qr_code_text: stdout.trim() });
  });
});


app.listen(4000 , () => {
    console.log("Server running at port 4000");
});
