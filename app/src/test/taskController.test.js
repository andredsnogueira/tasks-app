process.env.NODE_ENV = 'test';

const supertest = require('supertest');
const auth = require('../middlewares/auth');
const rabbitmq = require('../rabbitmq');
const taskRepository = require('../repositories/taskRepository');
let app;

jest.mock('../repositories/taskRepository');

describe('Tasks', () => {
  describe('/GET tasks', () => {
    beforeEach(() => {
      jest.spyOn(auth, 'verify').mockImplementation((req, res, next) => next());
      app = require('../app');
    });

    it("it should return 204 when there isn't any task", async (done) => {
      taskRepository.all.mockReturnValue([]);

      const res = await supertest(app).get('/tasks');
      expect(res.statusCode).toBe(204);

      done();
    });

    it('it should return 200 with two tasks', async (done) => {
      const tasks = [
        {
          name: 'test-name',
          summary: 'test-summary',
          creator_id: 1,
        },
        {
          name: 'test-name2',
          summary: 'test-summary2',
          creator_id: 2,
        },
      ];

      taskRepository.all.mockReturnValue(tasks);

      const res = await supertest(app).get('/tasks');

      expect(res.statusCode).toBe(200);
      expect(res.body.tasks.length).toBe(2);
      expect(res.body.tasks).toEqual(tasks);

      done();
    });

    it('it should return 500 when an exception is thrown', async (done) => {
      taskRepository.all.mockRejectedValue(() => {
        throw new Error('test-error');
      });

      const res = await supertest(app).get('/tasks');

      expect(res.statusCode).toBe(500);
      done();
    });
  });

  describe('/POST tasks', () => {
    beforeEach(() => {
      jest.spyOn(auth, 'verify').mockImplementation((req, res, next) => next());
      app = require('../app');
    });

    it('it should return 204 when the task is saved', async (done) => {
      taskRepository.save.mockReturnValue([1]);

      const res = await supertest(app)
        .post('/tasks')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({ name: 'test', summary: 'test-summary' });

      expect(res.statusCode).toBe(204);
      done();
    });

    it("it should return 400 when a task wasn't created", async (done) => {
      taskRepository.save.mockReturnValue(undefined);

      const res = await supertest(app)
        .post('/tasks')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({ name: 'test', summary: 'test-summary' });

      expect(res.statusCode).toBe(400);
      done();
    });

    it('it should return 500 when an exception is thrown', async (done) => {
      taskRepository.save.mockRejectedValue(() => {
        throw new Error('test-error');
      });

      const res = await supertest(app)
        .post('/tasks')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({ name: 'test', summary: 'test-summary' });

      expect(res.statusCode).toBe(500);
      done();
    });
  });

  describe('/PUT tasks/:id', () => {
    beforeEach(() => {
      jest.spyOn(auth, 'verify').mockImplementation((req, res, next) => next());
      app = require('../app');
    });

    it("it should return 400 when a task wasn't updated", async (done) => {
      taskRepository.update.mockReturnValue(0);

      const res = await supertest(app)
        .put('/tasks/1')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({ name: 'test', summary: 'test-summary' });

      expect(res.statusCode).toBe(400);
      done();
    });

    it('it should return 204 when the task is saved', async (done) => {
      taskRepository.update.mockReturnValue(1);

      const res = await supertest(app)
        .put('/tasks/1')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({ name: 'test', summary: 'test-summary' });

      expect(res.statusCode).toBe(204);
      done();
    });

    it('it should return 500 when an exception is thrown', async (done) => {
      taskRepository.update.mockRejectedValue(() => {
        throw new Error('test-error');
      });

      const res = await supertest(app)
        .put('/tasks/1')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({ name: 'test', summary: 'test-summary' });

      expect(res.statusCode).toBe(500);
      done();
    });
  });

  describe('/DELETE tasks/:id', () => {
    it("it should return 400 when the task wasn't deleted", async (done) => {
      jest.spyOn(auth, 'verify').mockImplementation((req, res, next) => {
        req.user = {
          manager: true,
        };
        next();
      });
      app = require('../app');

      taskRepository.delete.mockReturnValue(undefined);

      const res = await supertest(app).delete('/tasks/1');

      expect(res.statusCode).toBe(400);
      done();
    });

    it('it should return 204 when the task is saved', async (done) => {
      jest.spyOn(auth, 'verify').mockImplementation((req, res, next) => {
        req.user = {
          manager: true,
        };
        next();
      });
      app = require('../app');

      taskRepository.delete.mockReturnValue(1);

      const res = await supertest(app).delete('/tasks/1');

      expect(res.statusCode).toBe(204);
      done();
    });

    it('it should return 403 when the user is a technician', async (done) => {
      jest.spyOn(auth, 'verify').mockImplementation((req, res, next) => {
        req.user = {
          manager: false,
        };
        next();
      });
      app = require('../app');

      const res = await supertest(app).delete('/tasks/1');

      expect(res.statusCode).toBe(403);
      done();
    });

    it('it should return 500 when an exception is thrown', async (done) => {
      jest.spyOn(auth, 'verify').mockImplementation((req, res, next) => {
        req.user = {
          manager: true,
        };
        next();
      });
      app = require('../app');

      taskRepository.delete.mockRejectedValue(() => {
        throw new Error('test-error');
      });

      const res = await supertest(app).delete('/tasks/1');

      expect(res.statusCode).toBe(500);
      done();
    });
  });

  describe('/PATCH tasks/:id/complete', () => {
    it("it should return 400 when the task wasn't completed with success", async (done) => {
      jest.spyOn(auth, 'verify').mockImplementation((req, res, next) => next());
      app = require('../app');

      taskRepository.complete.mockReturnValue(0);

      const res = await supertest(app).patch('/tasks/1/complete');

      expect(res.statusCode).toBe(400);
      done();
    });

    it('it should return 204 when the task is marked as completed', async (done) => {
      jest.spyOn(rabbitmq, 'send').mockImplementation();
      jest.spyOn(auth, 'verify').mockImplementation((req, res, next) => next());
      app = require('../app');

      taskRepository.complete.mockReturnValue(1);
      taskRepository.getByUserAndId.mockReturnValue();

      const res = await supertest(app).patch('/tasks/1/complete');

      expect(res.statusCode).toBe(204);
      done();
    });

    it('it should return 500 when an exception is thrown', async (done) => {
      jest.spyOn(rabbitmq, 'send').mockImplementation();
      jest.spyOn(auth, 'verify').mockImplementation((req, res, next) => next());
      app = require('../app');

      taskRepository.complete.mockRejectedValue(() => {
        throw new Error('test-error');
      });
      taskRepository.getByUserAndId.mockReturnValue();

      const res = await supertest(app).patch('/tasks/1/complete');

      expect(res.statusCode).toBe(500);
      done();
    });
  });
});
