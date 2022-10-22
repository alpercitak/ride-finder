import {
  isPointInPolygon as isPointInPolygonGeoLib,
  isPointWithinRadius as isPointWithinRadiusGeoLib,
  isValidCoordinate as isValidCoordinateGeoLib,
} from 'geolib';

/**
 * Class for handling latitude, longitude pairs
 */
class GeoCoordinates {
  latitude: number;
  longitude: number;

  constructor(latitude: number, longitude: number) {
    this.latitude = latitude;
    this.longitude = longitude;
  }

  /**
   * Returns the coordinate pair formatted in string (latitude, longitude)
   *
   * @returns Coordinate pair
   */
  toString() {
    return `${this.latitude},${this.longitude}`;
  }
}

/**
 * Returns if the given coordinates are in the given polygon
 *
 * @param point - Coordinate pair to check (latitude, longitude)
 * @param polygon - Array of coordinates to create the polygon (pairs of latitude, longitude)
 * @returns true or false
 *
 */
const isPointInPolygon = (point: GeoCoordinates, polygon: GeoCoordinates[]): boolean => {
  return isPointInPolygonGeoLib(point, polygon);
};

/**
 * Returns if the given coordinates are in the given radius from starting point: center
 *
 * @param point - Coordinate pair to check (latitude, longitude)
 * @param center - Coordinate pair for creating a circle  (latitude, longitude)
 * @param radius - Radius of the circle to be created
 * @returns true or false
 *
 */
const isPointWithinRadius = (point: GeoCoordinates, center: GeoCoordinates, radius: number): boolean => {
  return isPointWithinRadiusGeoLib(point, center, radius);
};

/**
 * Returns if the given coordinates are valid
 *
 * @param point - Coordinate pair to check (latitude, longitude)
 * @returns true or false
 *
 */
const isValidCoordinate = (point: GeoCoordinates): boolean => {
  return isValidCoordinateGeoLib(point);
};

export { isPointInPolygon, isPointWithinRadius, isValidCoordinate, GeoCoordinates };
