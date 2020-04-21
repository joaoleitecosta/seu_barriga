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

test('Deve listar todas as contas', () => {
  return app
    .db('accounts')
    .insert({ name: 'Acc list', user_id: user.id })
    .then(() => {
      request(app)
        .get(MAIN_ROUTE)
        .then((result) => {
          expect(result.status).toBe(200);
          expect(result.body.length).toBeGreaterThan(0);
          expect(result.body[0]).toHaveProperty('name');
        });
    });
});

test('Deve retornar uma conta por id', () => {
  return app
    .db('accounts')
    .insert({ name: 'Acc by id', user_id: user.id }, ['id'])
    .then((acc) => request(app).get(`${MAIN_ROUTE}/${acc[0].id}`))
    .then((result) => {
      expect(result.status).toBe(200);
      expect(result.body.name).toBe('Acc by id');
      expect(result.body.user_id).toBe(user.id);
    });
});
