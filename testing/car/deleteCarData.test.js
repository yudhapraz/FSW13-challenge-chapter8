const request = require('supertest');
const app = require('../../app');
const { Car } = require('../../app/models');

let accessToken;
beforeAll(async () => {
  const loginAdmin = {
    email: 'Jayabaya@binar.co.id',
    password: '123456',
  };

  const response = await request(app)
    .post('/v1/auth/login')
    .send({ loginAdmin });
  accessToken = response.body.accessToken;
});
describe('DELETE /v1/tasks/:id', () => {
  let car;
  const createCarData = {
    name: 'Mazda Rx-7 4 Rotor Hycade Edition',
    price: 35000,
    size: 'SMALL',
    image: 'car.jpg',
    isCurrentlyRented: false,
  };
  beforeEach(async () => {
    car = await Car.create(createCarData);
    return car;
  });

  it('api should respond with status code 200 which indicates the process was successful', async () => request(app)
    .delete(`/v1/cars/${car.id}`)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${accessToken}`)
    .then((res) => {
      console.log(res.body);
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({
        message: expect.any(String),
      });
    }));
});
