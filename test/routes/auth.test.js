const request = require('supertest');
const app = require('../../src/app');

test('Deve criar usuario via signup', () => {
  const email = `${Date.now()}@teste.com`;
  return request(app)
    .post('/auth/signup')
    .send({
      name: 'Walter Junior',
      email,
      password: '123456',
    })
    .then((result) => {
      expect(result.status).toBe(201);
      expect(result.body.name).toBe('Walter Junior');
      expect(result.body.email).toBe(email);
      expect(result.body).not.toHaveProperty('password');
    });
});
test('Deve receber tokem ao logar', () => {
  const email = `${Date.now()}@teste.com`;
  return app.services.user
    .save({
      name: 'Walter Mitty',
      email,
      password: '123456',
    })
    .then(() =>
      request(app).post('/auth/signin').send({ email, password: '123456' })
    )
    .then((result) => {
      expect(result.status).toBe(200);
      expect(result.body).toHaveProperty('token');
    });
});

test('Não deve autenticar usuário com senha errada', () => {
  const email = `${Date.now()}@teste.com`;
  return app.services.user
    .save({
      name: 'Walter Mitty',
      email,
      password: '123456',
    })
    .then(() =>
      request(app).post('/auth/signin').send({ email, password: '12345' })
    )
    .then((result) => {
      expect(result.status).toBe(400);
      expect(result.body.error).toBe('Usuário ou senha inválidos');
    });
});

test('Não de autenticar usuário que não existe', () => {
  return request(app)
    .post('/auth/signin')
    .send({
      email: 'usuario_nao_existe@TextDecoderStream.com.br',
      password: 123456,
    })
    .then((result) => {
      expect(result.status).toBe(400);
      expect(result.body.error).toBe('Usuário ou senha inválidos');
    });
});

test('Não deve acessar uma rota protegida sem token', () => {
  return request(app)
    .get('/v1/users')
    .then((result) => {
      expect(result.status).toBe(401);
    });
});
