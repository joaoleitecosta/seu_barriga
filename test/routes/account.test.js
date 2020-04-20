const request = require('supertest');
const app = require('../../src/app');

const MAIN_ROUTE = '/accounts';

let user;

beforeAll(async () => {
  const result = await app.services.user.save({
    name: 'Joao Leite',
    email: `${Date.now()}@teste.com.br`,
    password: '123456',
  });
  user = { ...result[0] };
});

test('Deve inserir uma conta com sucesso', () =>
  request(app)
    .post(MAIN_ROUTE)
    .send({ name: 'Acc #1', user_id: user.id })
    .then((result) => {
      expect(result.status).toBe(201);
      expect(result.body.name).toBe('Acc #1');
    }));
