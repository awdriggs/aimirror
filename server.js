// server.js
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
// import OpenAI from 'openai'; // Import default

import apiRoutes from './routes/apiRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json({ limit: '10mb' })); // Increase JSON payload limit
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// app.use("/api/", apiRoutes); 
app.use('/api', apiRoutes);
 
// Serve static files from the 'public' directory
app.use(express.static('public'));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

