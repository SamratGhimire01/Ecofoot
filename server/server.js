// server.js
const express = require('express'); // Import Express
const axios = require('axios');    // Import Axios for API calls
const cors = require('cors');      // Import CORS middleware
require('dotenv').config();        // Load environment variables

const app = express();             // Initialize Express app

// Middleware
app.use(cors());                   // Enable CORS for all routes
app.use(express.json());           // Parse JSON request bodies
app.use(express.static('public')); // Serve static files from the "public" folder

// Route to calculate carbon footprint
app.post('/api/calculate-carbon-footprint', async (req, res) => {
  const { energyUsage } = req.body;
  console.log('Received Energy Usage:', energyUsage);

  // Validate input
  if (!energyUsage || isNaN(energyUsage)) {
    return res.status(400).json({ error: 'Invalid energy usage value' });
  }

  try {
    const response = await axios.post('https://api.carboninterface.com/v1/estimates', {
      type: 'electricity',
      electricity_unit: 'kwh',
      electricity_value: energyUsage,
      country: 'US'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CARBON_API_KEY}`
      }
    });

    console.log('Carbon Interface API Response:', response.data);
    const carbonFootprint = response.data.data.attributes.carbon_kg || 0;
    res.status(200).json({ carbonFootprint });
  } catch (error) {
    console.error('Carbon Interface API Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to calculate carbon footprint' });
  }
});

// Start the server
const PORT = process.env.PORT || 4000; // Use port 4000 or any available port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));