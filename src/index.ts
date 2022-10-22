import express, { Express, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import { getRides, GetRidesRequest, getPrices, GetPricesRequest } from './lib/service';
import { GeoCoordinates } from './lib/geo';
import promBundle from 'express-prom-bundle';

dotenv.config();

const app: Express = express();
const port: number = parseInt(process.env.PORT as string) || 8001;

/**
 * Initialize prometheus and mount to the path /metrics
 */
const metricsMiddleware = promBundle({
  includeMethod: true,
  includePath: true,
  includeStatusCode: true,
  includeUp: true,
  customLabels: { project_name: 'ride-finder', project_type: 'api' },
  promClient: {
    collectDefaultMetrics: {},
  },
  metricsPath: '/metrics',
});
app.use(metricsMiddleware);

/**
 * Convers the given value to boolean
 * @param value Value to be checked
 * @returns boolean
 */
const checkBoolean = (value: any): boolean => {
  return !(value === 'false' || value === '0' || value === '' || value === undefined);
};

/**
 * Checks if the number is a positive integer or zero
 * @param value Value to be checked
 * @returns boolean
 */
const isValidNumber = (value: number): boolean => {
  return !isNaN(value) && value >= 0;
};

/**
 * Endpoint root
 */
app.get('/', (req: Request, res: Response) => {
  return res.status(200).json({ message: 'Hello' });
});

/**
 * Endpoint for retrieving rides
 */
app.get('/rides', async (req: Request<{}, {}, {}, GetRidesRequest>, res: Response): Promise<Response> => {
  req.query.is_disabled = req.query.is_disabled ? checkBoolean(req.query.is_disabled) : undefined;
  req.query.is_reserved = req.query.is_reserved ? checkBoolean(req.query.is_reserved) : undefined;
  req.query.with_prices = req.query.with_prices ? checkBoolean(req.query.with_prices) : undefined;

  if (req.query.limit !== undefined) {
    req.query.limit = Number(req.query.limit);
    if (!isValidNumber(req.query.limit)) {
      return res.status(200).json({ error: '[limit] must be >= 0 and a valid number' });
    }
  }

  if (req.query.offset !== undefined) {
    req.query.offset = Number(req.query.offset);
    if (!isValidNumber(req.query.offset)) {
      return res.status(200).json({ error: '[offset] must be >= 0 and a valid number' });
    }
  }

  if (req.query.cluster_size !== undefined) {
    req.query.cluster_size = Number(req.query.cluster_size);
    if (!isValidNumber(req.query.cluster_size)) {
      return res.status(200).json({ error: '[cluster_size] must be >= 0 and a valid number' });
    }
  }

  if (req.query.polygon) {
    req.query.polygon = req.query.polygon.map((x) => {
      const arrCoordinates = x.toString().split(',');
      return new GeoCoordinates(parseFloat(arrCoordinates[0]), parseFloat(arrCoordinates[1]));
    });
  }

  if (req.query.center || req.query.radius) {
    if (req.query.center && !req.query.radius) {
      return res.status(200).json({ error: '[radius] is mandatory when [center] is provided' });
    }
    if (req.query.radius && !req.query.center) {
      return res.status(200).json({ error: '[center] is mandatory when [radius] is provided' });
    }

    if (req.query.center) {
      const arrCoordinates = req.query.center.toString().split(',');
      req.query.center = new GeoCoordinates(parseFloat(arrCoordinates[0]), parseFloat(arrCoordinates[1]));
    }

    if (req.query.radius) {
      req.query.radius = Number(req.query.radius);
      if (!isValidNumber(req.query.radius)) {
        return res.status(200).json({ error: '[radius] must be >= 0 and a valid number' });
      }
    }
  }

  const response = await getRides(req.query);
  return res.status(200).json({ data: response });
});

/**
 * Endpoint for retrieving prices
 */
app.get('/prices', async (req: Request<{}, {}, {}, GetPricesRequest>, res: Response): Promise<Response> => {
  const response = await getPrices(req.query);
  return res.status(200).json({ data: response });
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
