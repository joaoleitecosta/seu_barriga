require('dotenv').config();
const app = require('express')();
const consign = require('consign');
const knex = require('knex');
const knexfile = require('../knexfile');
//const knexLogger = require('knex-logger');

// TODO criar chaveamento dinamico
app.db = knex(knexfile.test);
//app.use(knexLogger(app.db));

consign({ cwd: 'src', verbose: false })
  .include('./config/passport.js')
  .then('./config/middlewares.js')
  .then('./services')
  .then('./routes')
  .then('./config/routes.js')
  .into(app);

app.use((err, req, res, next) => {
  const { name, message, stack } = err;

  if (name === 'ValidationError') res.status(400).json({ error: message });
  else res.status(500).json({ name, message, stack });
  next();
});

app.use((req, res) => {
  res
    .status(404)
    .send({ error: 'Você está tentando acessar uma rota que não existe' });
});

// app.db
//   .on('query', (query) => {
//     console.log({
//       sql: query.sql,
//       bindings: query.bindings ? query.bindings.join(',') : '',
//     });
//   })
//   .on('query-response', (response) => {
//     console.log(response);
//   })
//   .on('error', (error) => {
//     console.log(error);
//   });

module.exports = app;
