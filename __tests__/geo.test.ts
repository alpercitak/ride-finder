import { isPointInPolygon, isPointWithinRadius, isValidCoordinate } from '../src/geo';
import { GeoCoordinates } from '../src/geo/types';

describe('isPointInPolyon', (): void => {
  it('should return true', (): void => {
    const point = { latitude: 48.5, longitude: 2.25 };
    const polygon = [
      { latitude: 48.0, longitude: 2 },
      { latitude: 48.0, longitude: 2.27 },
      { latitude: 48.9, longitude: 2.27 },
      { latitude: 48.9, longitude: 2 },
    ];
    expect(isPointInPolygon(point, polygon)).toBeTruthy();
  });

  it('should return false', (): void => {
    const point = { latitude: 48.5, longitude: 3 };
    const polygon = [
      { latitude: 48.0, longitude: 2 },
      { latitude: 48.0, longitude: 2.27 },
      { latitude: 48.9, longitude: 2.27 },
      { latitude: 48.9, longitude: 2 },
    ];
    expect(isPointInPolygon(point, polygon)).toBeFalsy();
  });
});

describe('isPointWithinRadius', (): void => {
  it('should return true', (): void => {
    const point = { latitude: 51.525, longitude: 7.4575 };
    const center = { latitude: 51.5175, longitude: 7.4678 };
    const radius = 5000;
    expect(isPointWithinRadius(point, center, radius)).toBeTruthy();
  });

  it('should return false', (): void => {
    const point = { latitude: 51.525, longitude: 7.4575 };
    const center = { latitude: 51.5175, longitude: 7.4678 };
    const radius = 5;
    expect(isPointWithinRadius(point, center, radius)).toBeFalsy();
  });
});

describe('isValidCoordinate', (): void => {
  it('should return true', (): void => {
    const point = { latitude: 51.525, longitude: 7.4575 };
    expect(isValidCoordinate(point)).toBeTruthy();
  });

  it('should return false', (): void => {
    const point = { latitude: -360.233, longitude: -360.255 };
    expect(isValidCoordinate(point)).toBeFalsy();
  });
});

describe('GeoCoordinates', (): void => {
  it('should return true', (): void => {
    const point = { latitude: 51.525, longitude: 7.4575 };
    const expected = Object.values(point)
      .map((x) => x)
      .join(',');
    const coordinates = new GeoCoordinates(point.latitude, point.longitude);
    expect(coordinates.toString()).toEqual(expected);
  });

  it('should return false', (): void => {
    const point = { latitude: -360.233, longitude: -360.255 };
    expect(isValidCoordinate(point)).toBeFalsy();
  });
});
