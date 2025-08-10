import { Router, Request, Response } from 'express';
import config from '../config';
import { ApiResponse } from '../types';

const router = Router();

// Health check endpoint
router.get('/', (req: Request, res: Response) => {
  const response: ApiResponse = {
    success: true,
    message: 'GameTrust Auth API is running',
    data: {
      timestamp: new Date().toISOString(),
      environment: config.nodeEnv
    }
  };
  res.status(200).json(response);
});

export { router as healthRoutes };