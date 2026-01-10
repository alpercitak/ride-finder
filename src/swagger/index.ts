import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';
import type { RequestHandler } from 'express';

export default [swaggerUi.serve, swaggerUi.setup(swaggerDocument)] as Array<RequestHandler>;
