import promBundle from 'express-prom-bundle';

/**
 * Initialize prometheus and mount to the path /metrics
 */
export default promBundle({
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
