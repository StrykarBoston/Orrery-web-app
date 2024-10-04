// server.js
const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

// Serve static files (HTML, CSS, JS)
app.use(express.static('Public'));

// NASA API details
const NASA_API_KEY = '5s7b2Coc8U6xAFIKW9KudZ7Vigytsjf8jBKYwabA';
const NASA_API_URL = `https://api.nasa.gov/neo/rest/v1/feed?api_key=${'5s7b2Coc8U6xAFIKW9KudZ7Vigytsjf8jBKYwabA'}`;

// Route to fetch NEO data
app.get('/neo', async (req, res) => {
  try {
    const response = await axios.get('https://api.nasa.gov/neo/rest/v1/feed?start_date=2015-09-07&end_date=2015-09-08&api_key=5s7b2Coc8U6xAFIKW9KudZ7Vigytsjf8jBKYwabA');
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching NASA data:", error);
    res.status(500).send('Error fetching NASA data');
  }
});

// Serve the app on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
