/**
 * Simple OpenAI API test script
 * Run with: node test-openai.js
 */

import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Get directory of current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from project root .env file
const rootDir = join(__dirname, '../..');
const envPath = join(rootDir, '.env');

if (fs.existsSync(envPath)) {
  console.log(`Loading environment from ${envPath}`);
  dotenv.config({ path: envPath });
} else {
  console.log('No .env file found at project root, using process.env');
  dotenv.config();
}

// Get API key from environment variables
const API_KEY = process.env.AI_API_KEY;

if (!API_KEY) {
  console.error('Error: AI_API_KEY environment variable is not set');
  process.exit(1);
}

// Simple test content for OpenAI API
async function testOpenAIAPI() {
  console.log('Testing OpenAI API connection...');
  console.log(`API Key starts with: ${API_KEY.substring(0, 5)}...`);
  
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo', // Using a simpler model for testing
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: 'Say "The OpenAI API is working correctly!"' }
        ],
        max_tokens: 50
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('API Response:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    console.log('SUCCESS: OpenAI API is working correctly!');
  } catch (error) {
    console.error('ERROR: Failed to call OpenAI API');
    
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from server');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
    }
  }
}

// Run the test
testOpenAIAPI();