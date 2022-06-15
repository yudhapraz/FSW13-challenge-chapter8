const request = require('supertest');
const app = require('../../app');
const { Car } = require('../../app/models');

let car;
describe('Cars', () => {
  const insertCarData = {
    name: 'Nissan Skyline GT-R R34 Hycade Edition',
    price: 13500,
    size: 'MEDIUM',
    image: 'https://hodoor.asia/en/product/nissan-gt-r-custom-body-kit-by-hycade',
    isCurrentlyRented: false,
  };
  beforeAll(async () => {
    car = await Car.create(insertCarData);
    return car;
  });
  afterAll(() => car.destroy());
  it('Get car data by id', () => request(app)
    .get(`/v1/cars/${car.id}`)
    .set('Accept', 'application/json')
    .then((res) => {
      console.log(res.body);
      expect(res.statusCode).toBe(200);
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
});
