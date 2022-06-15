const request = require('supertest');
const app = require('../../app');
const { User } = require('../../app/models');

let AdminToken;
let CustomerToken;
let user;
describe('WHOAMI', () => {
  beforeAll(async () => {
    const accountAdmin = {
      email: 'johnny@binar.co.id',
      password: '123456',
    };

    const registerAccount = {
      name: 'dayatkaget',
      email: 'dayatvseverybody@binar.co.id',
      password: 'dayat12345',
    };
    const response = await request(app)
      .post('/v1/auth/login')
      .send(accountAdmin);
    AdminToken = response.body.accessToken;
    user = await request(app)
      .post('/v1/auth/register')
      .send(registerAccount);
    CustomerToken = user.body.accessToken;
  });
  afterAll(async () => {
    await User.destroy({
      where: {
        email: 'dayatvseverybody@binar.co.id',
      },
    });
  });
  it('Login as customer', () => request(app)
    .get('/v1/auth/whoami')
    .set('Accept', 'application/json')
    .set(
      'Authorization',
      `Bearer ${CustomerToken}`,
    )
    .then((res) => {
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        id: expect.any(Number),
        name: expect.any(String),
        email: expect.any(String),
        image: null,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    }));
  it('Login as admin', () => request(app)
    .get('/v1/auth/whoami')
    .set('Accept', 'application/json')
    .set(
      'Authorization',
      `Bearer ${AdminToken}`,
    )
    .then((res) => {
      expect(res.statusCode).toBe(401);
      expect(res.body).toEqual({
        error: {
          name: 'Error',
          message: 'Access forbidden!',
          details: {
            role: 'ADMIN',
            reason: 'ADMIN is not allowed to perform this operation.',
          },
        },
      });
    }));
  describe('delete user response', () => {
    beforeEach(async () => {
      await User.destroy({
        where: {
          email: 'dayatvseverybody@binar.co.id',
        },
      });
    });
    it('login while user already deleted', async () => request(app)
      .get('/v1/auth/whoami')
      .set('Accept', 'application/json')
      .set(
        'Authorization',
        `Bearer ${CustomerToken}`,
      )
      .then((res) => {
        expect(res.statusCode).toBe(404);
      }));
  });
});
