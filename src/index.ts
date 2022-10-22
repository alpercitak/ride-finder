import express, { Express, Request, Response } from 'express';
import * as dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port: number = parseInt(process.env.PORT as string) || 8001;

/**
 * Endpoint root
 */
app.get('/', (req: Request, res: Response) => {
  return res.status(200).json({ message: 'Hello' });
});

/**
 * Endpoint for health check
 */
app.get('/health', (req: Request, res: Response) => {
  return res.status(200).end();
});

/**
 * Initialize http server
 */
const server = app.listen(port, () => {
  console.log(`ride-finder started on port:${port}`);
});

export default server;
