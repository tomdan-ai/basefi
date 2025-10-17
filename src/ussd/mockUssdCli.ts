import readline from 'readline';
import axios from 'axios';
import logger from '../config/logger';

// Mock USSD CLI
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Generate a random session ID
const sessionId = `mock-session-${Math.random().toString(36).substring(2, 15)}`;
const serviceCode = '*384*12345#';
let phoneNumber = '';
let text = '';

// Start the USSD CLI
const startMockUssd = () => {
  console.log('\n===== MOCK USSD CLI =====');
  console.log('Enter your phone number to start:');
  
  rl.question('> ', async (input) => {
    phoneNumber = input.trim();
    await processUssd();
  });
};

// Process USSD requests
const processUssd = async () => {
  try {
    const response = await axios.post('http://localhost:3000/ussd', {
      sessionId,
      serviceCode,
      phoneNumber,
      text
    });
    
    // Display response
    console.log('\n===== USSD RESPONSE =====');
    console.log(response.data);
    
    // If response starts with "CON", continue the session
    if (response.data.startsWith('CON')) {
      rl.question('\nEnter your response: ', async (input) => {
        // Append the input to the text with * separator if text is not empty
        text = text ? `${text}*${input.trim()}` : input.trim();
        await processUssd();
      });
    } else {
      // If response starts with "END", session is terminated
      console.log('\nSession ended. Press Enter to start a new session.');
      rl.question('', () => {
        text = '';
        startMockUssd();
      });
    }
  } catch (error) {
    logger.error('Error processing USSD request:', error);
    console.log('\nError processing request. Press Enter to try again.');
    rl.question('', () => {
      startMockUssd();
    });
  }
};

// Start the CLI
console.log('Starting Mock USSD CLI...');
startMockUssd();

// Handle exit
process.on('SIGINT', () => {
  console.log('\nExiting Mock USSD CLI');
  rl.close();
  process.exit(0);
});