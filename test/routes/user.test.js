require('dotenv').config();

const jwt = require('jwt-simple');

const request = require('supertest');

const app = require('../../src/app');

const email = `${Date.now()}@mail.com`;
let user;

const MAIN_ROUTE = '/v1/users';

beforeAll(async () => {
  const result = await app.services.user.save({
    name: 'Usuario Autenticado',
    email: `${Date.now()}@mail.com`,
    password: '123456',
  });

  user = { ...result[0] };

  user.token = jwt.encode(user, process.env.SECRET);
});

test('Deve listar todos os usuários', () =>
  request(app)
    .get(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty('name');
      expect(res.body).not.toHaveProperty('password');
    }));

test('Deve inserir usuário com sucesso', () =>
  request(app)
    .post(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .send({
      name: 'Walter Mitty',
      email,
      password: '123456',
    })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Walter Mitty');
      expect(res.body).not.toHaveProperty('password');
    }));

test('Deve armazenar senha criptografada', async () => {
  const res = await request(app)
    .post(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .send({
      name: 'Walter Mitty',
      email: `${Date.now()}@mail.com`,
      password: '123456',
    });

  expect(res.status).toBe(201);

  const { id } = res.body;

  // const user = await app.db('MAIN_ROUTE').where({ id }).select();
  // expect(user[0]).toHaveProperty('password');

  const userDB = await app.services.user.findOne({ id });

  expect(userDB.password).not.toBeUndefined();
  expect(userDB.password).not.toBe('123456');
});

test('Não deve inserir usuario sem nome', () =>
  request(app)
    .post(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .send({ email, password: '123456' })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Nome é um campo obrigatório');
    }));

test('Não deve inserir usuário sem email', async () => {
  const result = await request(app)
    .post(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .send({ name: 'Teste', password: '123456' });
  expect(result.status).toBe(400);
  expect(result.body.error).toBe('Email é um campo obrigatório');
});

test('Não deve inserir usuário sem senha', (done) => {
  request(app)
    .post(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .send({ name: 'Jonh', email: 'jonh@teste.com' })
    .then((result) => {
      expect(result.status).toBe(400);
      expect(result.body.error).toBe('Senha é um campo obrigatório');
      done();
    })
    .catch((error) => done.fail(error));
});

test('Não deve inserir usuário com email repetido', () =>
  request(app)
    .post(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .send({ name: 'Jonh Milk', email, password: '222222' })
    .then((result) => {
      expect(result.status).toBe(400);
      expect(result.body.error).toBe('Já existe um usuário com esse email');
    }));
