import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectToDatabase } from './config/database';
import { handleUSSD } from './ussd/ussdService';
import { simulateDepositProcessing } from './services/depositProcessor';
import { checkPendingPayouts } from './services/payoutService';
import logger from './config/logger';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Update CORS configuration to allow requests from frontend
const corsOptions = {
  origin: process.env.FRONTEND_URL 
    ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
    : ['http://localhost:5173', 'https://avanomad.vercel.app', 'https://avanomad-esbp.onrender.com', 'http://localhost:5174'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
};

app.use(cors(corsOptions));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Avanomad API' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// USSD endpoint
app.post('/ussd', handleUSSD);

// Manual deposit processing endpoint (for demo)
app.post('/process-deposits', async (req, res) => {
  try {
    await simulateDepositProcessing();
    res.status(200).json({ success: true, message: 'Deposits processed' });
  } catch (error) {
    logger.error('Error processing deposits:', error);
    res.status(500).json({ success: false, error: 'Failed to process deposits' });
  }
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Connect to MongoDB and start server
connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      
      // Set up periodic deposit processing (every 30 seconds)
      setInterval(async () => {
        try {
          await simulateDepositProcessing();
        } catch (error) {
          logger.error('Error in scheduled deposit processing:', error);
        }
      }, 30000);

      // Check pending payouts every 5 minutes
      setInterval(async () => {
        try {
          await checkPendingPayouts();
        } catch (error) {
          logger.error('Error checking pending payouts:', error);
        }
      }, 5 * 60 * 1000);
    });
  })
  .catch((error) => {
    logger.error('Failed to start server:', error);
    process.exit(1);
  });