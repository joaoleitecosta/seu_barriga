const request = require('supertest');
const app = require('../../src/app');

test('Deve receber tokem ao logar', () => {
  const email = Date.now();
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
  const email = Date.now();
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
