process.env.NODE_ENV = 'test';

const supertest = require('supertest');
const authRepository = require('../repositories/authRepository');
const app = require('../app');

jest.mock('../repositories/authRepository');

describe('Authentication', () => {
  describe('/POST login', () => {
    it("it should return 404 when the email doesn't exist", async (done) => {
      authRepository.login.mockReturnValue(undefined);

      const res = supertest(app)
        .post('/login')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({ email: 'test-email@test.com', password: 'test-password' });

      expect((await res).statusCode).toBe(404);
      done();
    });
  });
});
