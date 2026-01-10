import { isPointInPolygon, isPointWithinRadius } from '../src/geo';
import { getRides, getPrices } from '../src/service';

describe('getRides', () => {
  it('should be array', async () => {
    const res1 = await getRides({ limit: 10 });
    expect(res1).toBeInstanceOf(Array);

    const res2 = await getRides({ offset: 1 });
    expect(res2).toBeInstanceOf(Array);

    const res3 = await getRides({ limit: 1, offset: 1 });
    expect(res3).toBeInstanceOf(Array);
  });

  it('should be all: disabled [true]', async () => {
    const res = await getRides({ limit: 10, is_disabled: true });
    const length = res.reduce((acc: number, val: any) => {
      return val.is_disabled ? ++acc : acc;
    }, 0);
    expect(res.length).toEqual(length);
  });

  it('should be all: disabled [false]', async () => {
    const res = await getRides({ limit: 10, is_disabled: false });
    const length = res.reduce((acc: number, val: any) => {
      return !val.is_disabled ? ++acc : acc;
    }, 0);
    expect(res.length).toEqual(length);
  });

  it('should be all: reserved [true]', async () => {
    const res = await getRides({ limit: 10, is_reserved: true });
    const length = res.reduce((acc: number, val: any) => {
      return val.is_reserved ? ++acc : acc;
    }, 0);
    expect(res.length).toEqual(length);
  });

  it('should be all: reserved [false]', async () => {
    const res = await getRides({ limit: 10, is_reserved: false });
    const length = res.reduce((acc: number, val: any) => {
      return !val.is_reserved ? ++acc : acc;
    }, 0);
    expect(res.length).toEqual(length);
  });

  it('should be all: pricing_plan_id [a4d5e9f0-3f82-459b-901f-41ef42fd2402]', async () => {
    const pricing_plan_id = 'a4d5e9f0-3f82-459b-901f-41ef42fd2402';
    const res = await getRides({ limit: 10, pricing_plan_id: pricing_plan_id });
    const length = res.reduce((acc: number, ride: any) => {
      return ride.pricing_plan_id == pricing_plan_id ? ++acc : acc;
    }, 0);
    expect(res.length).toEqual(length);
  });

  it('should be all: vehicle_type_id [escooter_paris]', async () => {
    const vehicle_type_id = 'escooter_paris';
    const res = await getRides({ limit: 10, vehicle_type_id: vehicle_type_id });
    const length = res.reduce((acc: number, ride: any) => {
      return ride.vehicle_type_id == vehicle_type_id ? ++acc : acc;
    }, 0);
    expect(res.length).toEqual(length);
  });

  it('should be all: in polygon', async () => {
    const polygon = [
      { latitude: 48.0, longitude: 2 },
      { latitude: 48.0, longitude: 2.27 },
      { latitude: 48.9, longitude: 2.27 },
      { latitude: 48.9, longitude: 2 },
    ];
    const res = await getRides({ limit: 10, polygon: polygon });
    const length = res.reduce((acc: number, ride: any) => {
      return isPointInPolygon({ latitude: ride.lat, longitude: ride.lon }, polygon) ? ++acc : acc;
    }, 0);
    expect(res.length).toEqual(length);
  });

  it('should be all: in radius from the center', async () => {
    const center = { latitude: 48.839768, longitude: 2.309268 };
    const radius = 100;

    const res = await getRides({ limit: 10, center: center, radius: radius });
    const length = res.reduce((acc: number, ride: any) => {
      return isPointWithinRadius({ latitude: ride.lat, longitude: ride.lon }, center, radius) ? ++acc : acc;
    }, 0);

    expect(res.length).toEqual(length);
  });

  it('should return error [cluster_size]', async () => {
    const res = await getRides({ limit: 10, cluster_size: -1 });
    expect(res).toHaveProperty('error');
  });
});

describe('getPrices', () => {
  it('should be array', async () => {
    const res = await getPrices({});
    expect(res).toBeInstanceOf(Array);
  });

  it('should be all: plan_id [a4d5e9f0-3f82-459b-901f-41ef42fd2402]', async () => {
    const plan_id = 'a4d5e9f0-3f82-459b-901f-41ef42fd2402';
    const res = await getPrices({ plan_id: plan_id });
    const length = res.reduce((acc: number, price: any) => {
      return price.plan_id === plan_id ? ++acc : acc;
    }, 0);
    expect(res.length).toEqual(length);
    expect(res).toBeInstanceOf(Array);
  });
});
