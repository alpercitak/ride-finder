import axios from 'axios';
import nodeCache from 'node-cache';

const cache = new nodeCache();

/**
 * Type declaration for all api requests
 */
type ApiRequest = {
  apiUrl: string;
  cacheKey?: string;
  rawResponse?: boolean;
};

/**
 * Returns the response from specific api
 * @param ApiRequest.apiUrl - Url to be called
 * @param ApiRequest.cacheKey - Checks and caches based on [ttl] value on response
 * @param ApiRequest.rawResponse - Should return all response or just data
 * @returns External data
 */
const makeRequest = async ({ apiUrl, cacheKey, rawResponse }: ApiRequest): Promise<any> => {
  if (cacheKey && !rawResponse) {
    const cacheValue = cache.get(cacheKey);
    if (cacheValue) {
      return cacheValue;
    }
  }

  const response = await axios.get(apiUrl);

  if (cacheKey && !rawResponse) {
    cache.set(cacheKey, response.data.data, response.data.ttl);
  }

  if (rawResponse) {
    return response;
  }

  return response.data.data;
};

/**
 * Returns the services
 * @param rawResponse - Should return all response or just data
 * @returns Defined services
 */
const getServices = async (rawResponse: boolean = false) => {
  return makeRequest({
    apiUrl: 'https://data-sharing.tier-services.io/tier_paris/gbfs/2.2',
    cacheKey: 'get-services',
    rawResponse,
  });
};

/**
 * Returns the pricing plans
 * @param rawResponse - Should return all response or just data
 * @returns Defined pricing plans
 */
const getPricingPlans = async (rawResponse: boolean = false) => {
  return makeRequest({
    apiUrl: 'https://data-sharing.tier-services.io/tier_paris/gbfs/2.2/system-pricing-plans',
    cacheKey: 'get-pricing-plans',
    rawResponse,
  });
};

/**
 * Returns the free bike status
 * @param rawResponse - Should return all response or just data
 * @returns Defined free bike status
 */
const getFreeBikeStatus = async (rawResponse: boolean = false) => {
  return makeRequest({
    apiUrl: 'https://data-sharing.tier-services.io/tier_paris/gbfs/2.2/free-bike-status',
    cacheKey: 'get-free-bike-status',
    rawResponse,
  });
};

export { getServices, getPricingPlans, getFreeBikeStatus };
