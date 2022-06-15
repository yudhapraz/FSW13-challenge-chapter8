const request = require('supertest');
const app = require('../../app');
const { User } = require('../../app/models');

describe('User', () => {
  const registerSuccess = {
    name: 'bobi',
    email: 'bobikeren@gmail.com',
    password: 'bobikerenbet',
  };

  const registerEmailAlreadyTaken = {
    name: 'joko sisule',
    email: 'bobikeren@gmail.com',
    password: 'bobikerenbet',
  };

  const emailEmpty = {
    name: '',
    email: '',
    password: '',
  };

  let user;
  afterAll(async () => {
    user = await User.destroy({
      where: {
        email: 'bobikeren@gmail.com',
      },
    });
  });
  it('Register user Success', () => request(app)
    .post('/v1/auth/register')
    .set('Accept', 'application/json')
    .send(registerSuccess)
    .then((res) => {
      console.log(res.body);
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({
        accessToken: expect.any(String),
      });
    }));

  it('Register user with email already taken', () => request(app)
    .post('/v1/auth/register')
    .set('Accept', 'application/json')
    .send(registerEmailAlreadyTaken)
    .then((res) => {
      console.log(res.body);
      expect(res.statusCode).toBe(422);
      expect.objectContaining({
        error: {
          name: expect.any(String),
          message: expect.any(String),
          details: {
            email: expect.any(String),
          },
        },
      });
    }));

  it('Register user with email was empty', () => request(app)
    .post('/v1/auth/register')
    .set('Accept', 'application/json')
    .send(emailEmpty)
    .then((res) => {
      // console.log(res.body)
      expect(res.statusCode).toBe(500);
      expect.objectContaining({
        error: {
          name: expect.any(String),
          message: expect.any(String),
          details: {
            email: null,
          },
        },
      });
    }));
});
