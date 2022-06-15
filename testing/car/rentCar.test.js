const request = require('supertest');
const dayjs = require('dayjs');
const app = require('../../app');
const { Car } = require('../../app/models');

dayjs().format();

describe('POST /v1/cars/:id/rent', () => {
  const loginAdmin = {
    email: 'fikri@binar.co.id',
    password: '123456',
  };
  const loginCustomer = {
    email: 'inicustomer@binar.co.id',
    password: 'customer',
  };
  let carResponse;
  let accessTokenAdmin;
  let accessTokenCustomer;
  let customer;
  const rentStartedAt = dayjs().add(1, 'day');
  // const rentStartedAt = '2022-06-07T22:20:55.029Z';
  const rentEndedAt = dayjs(rentStartedAt).add(1, 'day');
  // const rentEndedAt = '2022-06-07T22:20:55.029Z';

  beforeAll(async () => {
    accessTokenAdmin = await request(app)
      .post('/v1/auth/login').send(loginAdmin);

    accessTokenCustomer = await request(app)
      .post('/v1/auth/login').send(loginCustomer);

    carResponse = await request(app)
      .post('/v1/cars')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${accessTokenAdmin.body.accessToken}`)
      .send({
        name: 'Dodge Viper SRT ACR',
        price: 15000,
        size: 'SMALL',
        image: 'https://www.caranddriver.com/news/a15105446/2016-dodge-viper-acr-official-photos-and-info-news/',
      });

    return carResponse;
  });

  // afterAll(async () => {
  //   await Car.destroy({
  //     where: { id: carResponse.body.id },
  //   });
  // });

  it('rent a car before login as any role', () => request(app)
    .post(`/v1/cars/${carResponse.body.id}/rent`)
    .set('Content-Type', 'application/json')
    .send({ rentStartedAt, rentEndedAt })
    .then((res) => {
      expect(res.statusCode).toBe(401);
      expect(res.body).toEqual(res.body);
    }));
  it('rent a car without input', () => request(app)
    .post(`/v1/cars/${carResponse.body.id}/rent`)
    .set('Authorization', `Bearer ${accessTokenCustomer.body.accessToken}`)
    .set('Content-Type', 'application/json')
    .send({})
    .then((res) => {
      expect(res.statusCode).toBe(500);
      expect(res.body).toMatchObject({
        error: {
          name: 'Error',
          message: 'rentStartedAt must not be empty!!',
          details: null,
        },
      });
    }));
  it('rent a car', () => request(app)
    .post(`/v1/cars/${carResponse.body.id}/rent`)
    .set('Authorization', `Bearer ${accessTokenCustomer.body.accessToken}`)
    .set('Content-Type', 'application/json')
    .send({ rentStartedAt })
    .then((res) => {
      expect(res.statusCode).toBe(201);
      // expect(res.body).toEqual(res.body);
      expect(res.body).toMatchObject({
        id: expect.any(Number),
        carId: expect.any(Number),
        userId: expect.any(Number),
        rentStartedAt: expect.any(String),
        rentEndedAt: expect.any(String),
      });
    }));

  it('rent a car where the car has been rented by another customer', () => request(app)
    .post(`/v1/cars/${carResponse.body.id}/rent`)
    .set('Authorization', `Bearer ${accessTokenCustomer.body.accessToken}`)
    .set('Content-Type', 'application/json')
    .send({ rentStartedAt, rentEndedAt })
    .then((res) => {
      console.log(res.body);
      expect(res.statusCode).toBe(422);
      expect(res.body).toMatchObject({
        error: {
          name: expect.any(String),
          message: expect.any(String),
          details: {
            car: expect.any(Object),
          },
        },
      });
    }));
});
