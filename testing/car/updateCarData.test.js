const request = require('supertest');
const app = require('../../app');
const { Car } = require('../../app/models');

describe('Cars', () => {
  const loginAdmin = {
    email: 'johnny@binar.co.id',
    password: '123456',
  };

  const carCreate = {
    name: 'Nama Mobil Sebelum Terupdate',
    price: 15000,
    size: 'LARGE',
    image: 'https://wallpapercave.com/wp/sTAIfCg.jpg',
    isCurrentlyRented: false,
  };

  const carCreateUpdate = {
    name: 'Nama Mobil Sesudah Terupdate',
    price: 35000,
    size: 'MEDIUM',
    image: 'https://wallpapercave.com/wp/sTAIfCg.jpg',
  };

  let car;
  let accessToken;
  beforeAll(async () => {
    const response = await request(app)
      .post('/v1/auth/login')
      .send(loginAdmin);
    accessToken = response.body.accessToken;
    car = await Car.create(carCreate);

    return car;
  });

  afterAll(() => car.destroy());

  it('Create car update with valid input', async () => {
    console.log(car.id);
    await request(app)
      .put(`/v1/cars/${car.id}`)
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(carCreateUpdate)
      .then((res) => {
        console.log(res.body);
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({
          message: 'succesfully updated',
          data: {
            id: expect.any(Number),
            name: expect.any(String),
            price: expect.any(Number),
            size: expect.any(String),
            image: expect.any(String),
            isCurrentlyRented: expect.any(Boolean),
            updatedAt: expect.any(String),
            createdAt: expect.any(String),
          },
        });
      });
  });
  it('Create car update with wrong input id', async () => await request(app)
    .put('/v1/cars/-972362736')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${accessToken}`)
    .send(carCreateUpdate)
    .then((res) => {
      console.log(res.body);
      expect(res.statusCode).toBe(422);
      expect(res.body).toEqual({
        error: {
          name: 'TypeError',
          message: 'Cannot read properties of null (reading \'id\')',
        },
      });
    }));
});
