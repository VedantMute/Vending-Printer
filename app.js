const express = require('express');
const Razorpay = require('razorpay');
const fs = require('fs');
const { exec } = require('child_process');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

// Razorpay Configuration
const razorpay = new Razorpay({
  key_id: 'rzp_test_5tVHs4Ujfblq6R',
  key_secret: 'AACi2JsGeSLlYq0ZISIRHHtN',
});

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + Date.now() + ext);
  }
});
const upload = multer({ storage: storage });

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Define a route to handle payment initiation
app.get('/initiate-payment', (req, res) => {
 
  const amount = req.query.amount;


  const options = {
    amount: amount *100, // Amount in paise (5 rupees)
    currency: 'INR',
    receipt: 'order_receipt_1',
    payment_capture: 1,
  };

  razorpay.orders.create(options, (err, order) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error creating Razorpay order');
    }

    res.json(order);
  });
});

// Define a route to handle file upload and execute Python script
app.post('/upload-and-execute-script', upload.array('files'), (req, res) => {
  const files = req.files;
  if (!files) {
    return res.status(400).send('No files were uploaded.');
  }

  // Execute Python script
  exec('python temp.py', (error, stdout, stderr) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Error executing Python script.');
    }
    console.log(stdout);
    console.error(stderr);
    res.send('Python script executed successfully.');
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
