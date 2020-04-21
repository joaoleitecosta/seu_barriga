const request = require('supertest');

const app = require('../src/app');

test('Deve retorna um erro informando que a rota não existe', () => {
  return request(app)
    .get('/')
    .then((res) => {
      expect(res.status).toBe(404);
      expect(res.body.error).toBe(
        'Você está tentando acessar uma rota que não existe'
      );
    });
});
