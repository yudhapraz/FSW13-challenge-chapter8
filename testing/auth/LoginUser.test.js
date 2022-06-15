const request = require('supertest');
const app = require('../../app');

let accessToken;
describe('POST /v1/auth/login', () => {
  const email = 'Jayabaya@binar.co.id';
  const password = '123456';
  const emailNotRegistered = 'Baksobakar@binar.co.id';
  it('User Login With Verified email', async () => await request(app)
    .post('/v1/auth/login')
    .set('Content-type', 'application/json')
    .send({
      email,
      password,
    })
    .then((res) => {
      // console.log(res.body)
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual(
        expect.objectContaining({
          accessToken: expect.any(String),
        }),
      );
    }));
  it('User login With unregistered email', () => request(app)
    .post('/v1/auth/login')
    .set('Accept', 'application/json')
    .send({
      email: emailNotRegistered,
      password,
    })
    .then((res) => {
      // console.log(res.body)
      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({
        error: {
          name: expect.any(String),
          message: expect.any(String),
          details: {
            email: expect.any(String),
          },
        },
      });
    }));
  it('User login with wrong password', () => request(app)
    .post('/v1/auth/login')
    .set('Accept', 'application/json')
    .send({
      email,
      password: 'baksobakarmangendut',
    })
    .then((res) => {
      console.log(res.body);
      expect(res.statusCode).toBe(401);
      expect.objectContaining({
        error: {
          name: expect.any(String),
          message: expect.any(String),
          details: null,
        },
      });
    }));
});
