const request = require('supertest');
const app = require('../../app');
const { Cars } = require('../../app/models');

let accessToken;
describe('Create New Cars', () => {
  const insertNewCar = {
    name: 'Mitsubishi Lancer Evolution Voltex Edition',
    price: 3500,
    image: 'https://wallpapercave.com/wp/sTAIfCg.jpg',
    size: 'MEDIUM',
  };

  const insertErrorCarData = {
    name: '',
    price: '',
    image: '',
    size: '',
  };

  beforeAll(async () => {
    const response = await request(app)
      .post('/v1/auth/login')
      .send({
        email: 'JayaBaya@binar.co.id',
        password: '123456',
      });
    accessToken = response.body.accessToken;
  });
  afterAll(async () => {
    await Cars.destroy({
      where: {
        name: 'Mitsubishi Lancer Evolution Voltex Edition',
      },
    });
  });
  it('Create A New Success Car Data', () => request(app)
    .post('/v1/cars')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({ insertNewCar })
    .then((res) => {
      console.log(res.body);
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({
        id: expect.any(Number),
        name: expect.any(String),
        price: expect.any(Number),
        size: expect.any(String),
        image: expect.any(String),
        isCurrentlyRented: expect.any(Boolean),
        updatedAt: expect.any(String),
        createdAt: expect.any(String),
      });
    }));
  it('Create A New Car Data With Invalid Type Input', async () => await request(app)
    .post('/v1/cars')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({})
    .then((res) => {
      console.log(res.body);
      expect(res.statusCode).toBe(422);
      expect(res.body).toEqual({
        error: {
          name: expect.any(String),
          message: expect.any(String),
        },
      });
    }));
});
