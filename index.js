dotenv.config(); // Load environment variables from a .env file
import express from 'express'; // Import the Express framework
import axios from 'axios'; // Import Axios for making HTTP requests
import dotenv from 'dotenv'; // Import dotenv for environment variables

dotenv.config(); // Load environment variables from a .env file

const app = express(); // Create an instance of an Express application
const PORT = 3000; // Define the port the server will listen on

// Set EJS as the template engine
app.set('view engine', 'ejs');

// Serve static files from the "public" directory
app.use(express.static('public'));

// Define the root route
app.get('/', async (req, res) => {
  // Retrieve latitude, longitude, and API key from environment variables
  const lat = process.env.LAT;
  const lon = process.env.LON;
  const apiKey = process.env.OPENUV_API_KEY;

  try {
    // Make a GET request to the OpenUV API to fetch UV data
    const response = await axios.get('https://api.openuv.io/api/v1/uv', {
      headers: { 'x-access-token': apiKey }, // Pass the API key in the headers
      // Pass the API key in the headers
      params: { lat: lat, lng: lon, dt: req.query.date } // Pass latitude, longitude, and date as query parameters
    });

    // Extract the UV index from the API response
    const uv = response.data.result.uv;

    // Determine the message based on the UV index
    let message = uv >= 3 ? "Yes, wear sunscreen today!" : "No need for sunscreen today.";

    // Render the "index" view with the UV index and message
    res.render('index', { uv, message });
  } catch (error) {
    // Log the error and render the "index" view with an error message
    console.error('Error fetching UV data:', error.message);
    res.render('index', { uv: 'N/A', message: 'Unable to fetch UV data. Try again later.' });
  }
});

app.get('/get-uv', async (req, res) => {
  // Retrieve latitude, longitude, and API key from environment variables
  const lat = process.env.LAT;
  const lon = process.env.LON;
  const apiKey = process.env.OPENUV_API_KEY;

  try {
    // Make a GET request to the OpenUV API to fetch UV data
    const response = await axios.get('https://api.openuv.io/api/v1/uv', {
      headers: { 'x-access-token': apiKey }, // Pass the API key in the headers
      // Pass the API key in the headers
      params: { lat: lat, lng: lon, dt: req.query.date } // Pass latitude, longitude, and date as query parameters
    });

    // Extract the UV index from the API response
    const uv = res.data.result.uv;
    

    // Determine the message based on the UV index
    let message = uv >= 3 ? "Yes, wear sunscreen today!" : "No need for sunscreen today.";

    // Render the "index" view with the UV index and message
    res.render('index', { uv, message });
  } catch (error) {
    // Log the error and render the "index" view with an error message
    console.error('Error fetching UV data:', error.response.error);
    res.render('index', { uv: 'N/A', message: error.response.data.error || 'Unable to fetch UV data. Try again later.' });
  }
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
