import type { GeoCoordinates } from '../geo/types';

/**
 * Type declaration of request for: getRides
 */
export type GetRidesRequest = {
  is_disabled?: boolean;
  is_reserved?: boolean;
  pricing_plan_id?: string;
  vehicle_type_id?: string;

  polygon?: Array<GeoCoordinates>;

  center?: GeoCoordinates;
  radius?: number;

  offset?: number;
  limit?: number;

  with_prices?: boolean;
  cluster_size?: number;
};

/**
 * Type declaration of ride
 */
export type Ride = {
  bike_id: string;
  is_disabled: boolean;
  is_reserved: boolean;
  lat: number;
  lon: number;
  pricing_plan_id: string;
  vehicle_type_id: string;
};

/**
 * Type declaration of request for: getPrices
 */
export type GetPricesRequest = {
  plan_id?: string;
};

/**
 * Type declaration of price
 */
export type Price = {
  plan_id: string;
};
