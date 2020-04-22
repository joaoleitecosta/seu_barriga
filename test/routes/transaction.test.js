require('dotenv').config();
const jwt = require('jwt-simple');
const request = require('supertest');

const app = require('../../src/app');

const MAIN_ROUTE = '/v1/transactions';

let user1;
let user2;
let account1;
let account2;

beforeAll(async () => {
  await app.db('transactions').del();
  await app.db('accounts').del();
  await app.db('users').del();

  const users = await app.db('users').insert(
    [
      {
        name: 'User #1',
        email: 'user1@teste.com',
        password:
          '$2a$10$PMdv4I5dmbJoZp/CoNHRNuDtQllv4x3TCbqbAx/u3.wegVaQUAsMi',
      },
      {
        name: 'User #2',
        email: 'user2@teste.com',
        password:
          '$2a$10$PMdv4I5dmbJoZp/CoNHRNuDtQllv4x3TCbqbAx/u3.wegVaQUAsMi',
      },
    ],
    '*'
  );
  [user1, user2] = users;

  const accounts = await app.db('accounts').insert(
    [
      { name: 'Acc #1', user_id: user1.id },
      { name: 'Acc #2', user_id: user2.id },
    ],
    '*'
  );

  [account1, account2] = accounts;
  delete user1.password;
  user1.token = jwt.encode(user1, process.env.SECRET);
});

test('Deve listar apenas as transações do usuários', () => {
  return app
    .db('transactions')
    .insert([
      {
        description: 'T1',
        date: new Date(),
        ammount: 100,
        type: 'I',
        acc_id: account1.id,
      },
      {
        description: 'T2',
        date: new Date(),
        ammount: 150,
        type: 'O',
        acc_id: account2.id,
      },
    ])
    .then(() =>
      request(app).get(MAIN_ROUTE).set('authorization', `bearer ${user1.token}`)
    )
    .then((result) => {
      expect(result.status).toBe(200);
      expect(result.body).toHaveLength(1);
      expect(result.body[0].description).toBe('T1');
    });
});
