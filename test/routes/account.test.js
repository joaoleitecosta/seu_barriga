require('dotenv').config();
const jwt = require('jwt-simple');
const request = require('supertest');
const app = require('../../src/app');

const MAIN_ROUTE = '/v1/accounts';

let user;
let user2;

//*! beforeAll execulta antes de todos os testes,
//*! e beforeEach execulta a cada teste
beforeEach(async () => {
  const result = await app.services.user.save({
    name: 'User Account 1',
    email: `${Date.now()}@teste.com.br`,
    password: '123456',
  });
  user = { ...result[0] };

  const result2 = await app.services.user.save({
    name: 'User Account 2',
    email: `${Date.now()}@teste.com.br`,
    password: '123456',
  });

  user2 = { ...result2[0] };

  user.token = jwt.encode(user, process.env.SECRET);
});

test('Deve inserir uma conta com sucesso', () =>
  request(app)
    .post(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .send({ name: 'Acc #1' })
    .then((result) => {
      expect(result.status).toBe(201);
      expect(result.body.name).toBe('Acc #1');
    }));

test('Não deve inserir uma conta sem nome', () =>
  request(app)
    .post(`${MAIN_ROUTE}`)
    .set('authorization', `bearer ${user.token}`)
    .send({})
    .then((result) => {
      expect(result.status).toBe(400);
      expect(result.body.error).toBe('Nome é um atributo obrigatório');
    }));

test('Deve listar apenas as contas do usuario', () => {
  return app
    .db('accounts')
    .insert([
      { name: 'Acc User #1', user_id: user.id },
      { name: 'Acc User #2', user_id: user2.id },
    ])
    .then(() =>
      request(app).get(MAIN_ROUTE).set('authorization', `bearer ${user.token}`)
    )
    .then((result) => {
      expect(result.status).toBe(200);
      expect(result.body.length).toBe(1);
      expect(result.body[0].name).toBe('Acc User #1');
    });
});

test('Deve retornar uma conta por id', () => {
  return app
    .db('accounts')
    .insert({ name: 'Acc by id', user_id: user.id }, ['id'])
    .then((acc) =>
      request(app)
        .get(`${MAIN_ROUTE}/${acc[0].id}`)
        .set('authorization', `bearer ${user.token}`)
    )
    .then((result) => {
      expect(result.status).toBe(200);
      expect(result.body.name).toBe('Acc by id');
      expect(result.body.user_id).toBe(user.id);
    });
});

test('Deve poder alterar uma conta', () => {
  return app
    .db('accounts')
    .insert({ name: 'Acc by put', user_id: user.id }, ['id'])
    .then((acc) =>
      request(app)
        .put(`${MAIN_ROUTE}/${acc[0].id}`)
        .set('authorization', `bearer ${user.token}`)
        .send({ name: 'Acc update' })
    )
    .then((result) => {
      expect(result.status).toBe(200);
      expect(result.body.name).toBe('Acc update');
    });
});

test('Deve remover uma conta', () => {
  return app
    .db('accounts')
    .insert({ name: 'Acc delete', user_id: user.id }, ['id'])
    .then((acc) =>
      request(app)
        .delete(`${MAIN_ROUTE}/${acc[0].id}`)
        .set('authorization', `bearer ${user.token}`)
    )
    .then((result) => {
      expect(result.status).toBe(204);
    });
});
