/**
 * Class for handling latitude, longitude pairs
 */
export class GeoCoordinates {
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
