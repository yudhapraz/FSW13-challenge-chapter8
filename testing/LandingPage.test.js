const request = require('supertest');
const page = require('../app');

describe('GET /', () => {
  it('the application should display a status code of 200 or OK which means the application can run normally', async () => request(page)
    .get('/')
    .then((res) => {
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toEqual('OK');
      expect(res.body.message).toEqual('BCR API is up and running!');
    }));

  it('the app should display the status code 404 Not Found which means the page was not found', async () => request(page)
    .get('/App')
    .then((res) => {
      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({
        error: {
          name: 'Error',
          message: 'Not found!',
          details: { method: 'GET', url: '/App' },
        },
      });
    }));
});
