const request = require('supertest');

const app = require('../../src/app');

test('Deve listar todos os usuários', () => {
  return request(app)
    .get('/users')
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty('name', 'Walter Mitty');
    });
});

test('Deve inserir usuário com sucesso', () => {
  const email = `${Date.now()}@mail.com`;
  return request(app)
    .post('/users')
    .send({
      name: 'Walter Mitty',
      email,
      password: '123456',
    })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Walter Mitty');
    });
});

test('Não deve inserir usuario sem nome', () => {
  const email = `${Date.now()}@mail.com`;
  return request(app)
    .post('/users')
    .send({ email, password: '123456' })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Nome é um campo obrigatório');
    });
});

test('Não deve inserir usuário sem email', async () => {
  const result = await request(app)
    .post('/users')
    .send({ name: 'Teste', password: '123456' });
  expect(result.status).toBe(400);
  expect(result.body.error).toBe('Email é um campo obrigatório');
});

test('Não deve inserir usuário sem senha', (done) => {
  request(app)
    .post('/users')
    .send({ name: 'Jonh', email: 'jonh@teste.com' })
    .then((result) => {
      expect(result.status).toBe(400);
      expect(result.body.error).toBe('Senha é um campo obrigatório');
      done();
    })
    .catch((error) => done.fail(error));
});
