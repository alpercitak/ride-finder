import { getServices, getPricingPlans, getFreeBikeStatus } from '../lib/gbfsApi';

describe('getServices', () => {
  it('should return 200', async () => {
    const res = await getServices(true);
    expect(res.status).toEqual(200);
  });

  it('should have properties', async () => {
    for (let i = 0; i < 2; i++) {
      const res = await getServices();
      expect(res).toHaveProperty('en.feeds');
    }
  });
});

describe('getPricingPlans', () => {
  it('should return 200', async () => {
    const res = await getPricingPlans(true);
    expect(res.status).toEqual(200);
  });

  it('should have properties', async () => {
    const res = await getPricingPlans();
    expect(res).toHaveProperty('plans');
  });
});

describe('getFreeBikeStatus', () => {
  it('should return 200', async () => {
    const res = await getFreeBikeStatus(true);
    expect(res.status).toEqual(200);
  });

  it('should have properties', async () => {
    const res = await getFreeBikeStatus();
    expect(res).toHaveProperty('bikes');
  });
});
