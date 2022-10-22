const request = require('supertest');

describe('index', () => {
  let server: any;
  beforeAll(async () => {
    process.env.PORT = undefined;
    const mod = await import('../index');
    server = (mod as any).default;
  });

  afterAll((done) => {
    if (server) {
      server.close(done);
    }
  });

  it('[/] should return Hello', async () => {
    const res = await request(server).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ message: 'Hello' });
  });

  it('[/rides] should return rides', async () => {
    const res = await request(server).get('/rides?limit=10');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toBeInstanceOf(Array);
  }, 30000);

  it('[/rides] should be all: disabled [true]', async () => {
    const res = await request(server).get('/rides?limit=10&is_disabled=true');
    const length = res.body.data.reduce((acc: number, val: any) => {
      return val.is_disabled ? ++acc : acc;
    }, 0);
    expect(res.body.data.length).toEqual(length);
  });

  it('[/rides] should be all: reserved [false]', async () => {
    const res = await request(server).get('/rides?limit=10&is_reserved=false');
    const length = res.body.data.reduce((acc: number, val: any) => {
      return !val.is_reserved ? ++acc : acc;
    }, 0);
    expect(res.body.data.length).toEqual(length);
  });

  it('[/rides] should return rides [with_prices]', async () => {
    const res = await request(server).get('/rides?limit=10&with_prices=true');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toBeInstanceOf(Array);

    const length = res.body.data.reduce((acc: number, ride: any) => {
      return ride['pricing_plan'] ? ++acc : acc;
    }, 0);

    expect(res.body.data.length).toEqual(length);
  });

  it('[/rides] should return rides [cluster_size]', async () => {
    const length = 2;
    const res = await request(server).get(`/rides?limit=10&cluster_size=${length}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toBeInstanceOf(Array);

    const clusterLength = res.body.data.length;
    expect(clusterLength).toEqual(length);
  });

  it('[/rides] should return rides [center & radius]', async () => {
    const center = '48.839768,2.309268';
    const radius = 1000;
    const res = await request(server).get(`/rides?limit=10&center=${center}&radius=${radius}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toBeInstanceOf(Array);
  });

  it('[/rides] should return error [center & !radius]', async () => {
    const center = '48.839768,2.309268';
    const res = await request(server).get(`/rides?limit=10&center=${center}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('error');
  });

  it('[/rides] should return error [!center & radius]', async () => {
    const radius = 1000;
    const res = await request(server).get(`/rides?limit=10&radius=${radius}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('error');
  });

  it('[/rides] should return error [radius]', async () => {
    const center = '48.839768,2.309268';
    const radius = -1;
    const res = await request(server).get(`/rides?limit=10&center=${center}&radius=${radius}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('error');
  });

  it('[/rides] should return rides [polygon]', async () => {
    const res = await request(server).get(
      `/rides?limit=10&polygon[]=48.0,2.0&polygon[]=48.0,2.27&polygon[]=48.9,2.27&polygon[]=48.9,2.31`
    );
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toBeInstanceOf(Array);
  });

  it('[/rides] should return error [limit]', async () => {
    const res = await request(server).get(`/rides?limit=-1`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('error');
  });

  it('[/rides] should return error [offset]', async () => {
    const res = await request(server).get(`/rides?offset=-1`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('error');
  });

  it('[/rides] should return error [cluster_size]', async () => {
    const res = await request(server).get(`/rides?cluster_size=-1`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('error');
  });

  it('[/prices] should return prices', async () => {
    const res = await request(server).get(`/prices`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('data');
  });

  it('[/prices] should return prices []', async () => {
    const res = await request(server).get(`/prices`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('data');
  });

  it('[/prices] should be all: plan_id [a4d5e9f0-3f82-459b-901f-41ef42fd2402]', async () => {
    const plan_id = 'a4d5e9f0-3f82-459b-901f-41ef42fd2402';
    const res = await request(server).get(`/prices?plan_id=${plan_id}`);
    expect(res.body).toHaveProperty('data');

    const length = res.body.data.reduce((acc: number, price: any) => {
      return price.plan_id === plan_id ? ++acc : acc;
    }, 0);
    expect(res.body.data.length).toEqual(length);
  });

  it('[/health] should return 200', async () => {
    const res = await request(server).get(`/health`);
    expect(res.statusCode).toEqual(200);
  });

  it('[/metrics] should return 200', async () => {
    const res = await request(server).get(`/metrics`);
    expect(res.statusCode).toEqual(200);
  });
});
