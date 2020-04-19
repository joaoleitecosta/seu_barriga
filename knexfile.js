require('dotenv').config();

module.exports = {
  test: {
    client: 'pg',
    version: '9.6',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: 'src/migrations',
    },
  },
};
