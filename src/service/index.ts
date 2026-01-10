import { isPointInPolygon, isPointWithinRadius } from '../geo';
import { getFreeBikeStatus, getPricingPlans } from '../gbfs';
import type { GetPricesRequest, GetRidesRequest, Price, Ride } from './types';
const kmeans = require('node-kmeans');

/**
 * Returns the expected rides by fetching, filtering and transforming
 * @param args Request parameters
 * @returns Array of rides
 */
const getRides = async (args: GetRidesRequest): Promise<any> => {
  const rides = (await getFreeBikeStatus()).bikes;

  let prices: any;

  if (args.with_prices) {
    const pricesData = await getPrices({});
    prices = pricesData.reduce((map: any, price: Price) => {
      map[price.plan_id] = price;
      return map;
    }, {});
  }

  const ridesFound = rides
    .filter(
      (ride: Ride) =>
        (typeof args.polygon !== 'undefined'
          ? isPointInPolygon({ latitude: ride.lat, longitude: ride.lon }, args.polygon)
          : ride) &&
        (typeof args.center !== 'undefined' && typeof args.radius !== 'undefined'
          ? isPointWithinRadius({ latitude: ride.lat, longitude: ride.lon }, args.center, args.radius)
          : ride) &&
        (typeof args.is_disabled !== 'undefined' ? ride.is_disabled == args.is_disabled : ride) &&
        (typeof args.is_reserved !== 'undefined' ? ride.is_reserved == args.is_reserved : ride) &&
        (args.pricing_plan_id ? ride.pricing_plan_id === args.pricing_plan_id : ride) &&
        (args.vehicle_type_id ? ride.vehicle_type_id === args.vehicle_type_id : ride)
    )
    .slice(args.offset, args.limit ? (args.offset === undefined ? 0 : args.offset) + args.limit : undefined)
    .map((ride: Ride) => {
      if (args.with_prices && prices) {
        (ride as any).pricing_plan = prices[ride.pricing_plan_id];
        delete (ride as any)['pricing_plan_id'];
      }

      return ride;
    });

  // if any cluster_size is given, found items should be clustered
  if (args.cluster_size) {
    const vectors = ridesFound.map((ride: Ride) => [ride.lat, ride.lon]);

    return new Promise((resolve) => {
      kmeans.clusterize(vectors, { k: args.cluster_size }, (err: any, res: any) => {
        if (err) {
          return resolve({ error: 'error while clustering' });
        }

        const response = res.map((x: any, ix: number): any => {
          return {
            cluster_index: ix,
            center: { lat: x.centroid[0], lon: x.centroid[1] },
            rides: x.clusterInd.map((i: number) => ridesFound[i]),
          };
        });

        return resolve(response);
      });
    });
  }

  return ridesFound;
};

/**
 * Returns pricing plans
 * @param args Request parameters
 * @returns Array of prices
 */
const getPrices = async (args: GetPricesRequest): Promise<Array<Price>> => {
  const prices = (await getPricingPlans()).plans;

  const pricesFound = prices
    .filter((price: Price) => {
      return args.plan_id !== undefined ? args.plan_id === price.plan_id : price;
    })
    .map((price: Price) => {
      return price;
    });

  return pricesFound;
};

export { getRides, getPrices };
