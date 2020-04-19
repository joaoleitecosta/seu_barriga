const supertest = require('supertest');

const request = supertest('http://localhost:3001');

test('Deve responder na porta 3001', () => {
  //acessar a url http://localhost:3001

  return request.get('/').then((resp) => expect(resp.status).toBe(200));
  //verificar que a resposta foi 200
});
