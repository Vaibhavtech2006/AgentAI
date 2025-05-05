import express from 'express';
import { readFile } from 'fs/promises';
import axios from 'axios';
import path from 'path';

const app = express();
const port = 3000;

// Middleware to parse JSON body
app.use(express.json());

// Function to send the POST request with the payload
async function sendPostRequest(prompt, firstMessage, number) {
  const url = 'https://a1f4-2402-8100-27f2-3d11-35f5-1b24-3291-1837.ngrok-free.app/outbound-call';
  const data = {
    prompt: prompt,
    first_message: firstMessage,
    number: number
  };
  
  console.log(`Sending request for: ${number}`);

  try {
    // Send the POST request using axios
    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Log the response to check if the call was initiated
    console.log(`Response for ${number}:`, response.data);

    // Check if the response indicates success
    if (response.data.success) {
      console.log(`Call initiated successfully for ${number}.`);
    } else {
      console.error(`Failed to initiate call for ${number}. Response: ${JSON.stringify(response.data)}`);
    }
  } catch (error) {
    // Handle errors during the HTTP request
    console.error(`Error sending POST request for ${number}:`, error.message);
  }
}

// Automatically start processing the JSON file when the server starts
async function startProcessingCalls() {
  const filePath = path.resolve('./data.json'); // Path to the data.json file

  try {
    const data = await readFile(filePath, 'utf8');
    const jsonData = JSON.parse(data);

    const { prompt, first_message, numbers } = jsonData;

    if (!prompt || !first_message || !Array.isArray(numbers)) {
      console.error('Invalid data in JSON file.');
      return;
    }

    console.log('Starting to process calls...');

    // Process each number and make the outbound call
    for (let i = 0; i < numbers.length; i++) {
      const number = numbers[i];
      console.log(`Sending call to: ${number}`);

      // Send the POST request
      await sendPostRequest(prompt, first_message, number);

      // Delay between requests to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for 3 seconds between calls
    }

    console.log('All calls are being processed.');

  } catch (err) {
    console.error('Error reading the JSON file:', err);
  }
}

// Start the server and automatically process calls
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  startProcessingCalls(); // Automatically start processing as soon as the server starts
});
