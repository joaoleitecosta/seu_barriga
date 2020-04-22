require('dotenv').config();
const express = require('express');
const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');
const ValidateError = require('../erros/validation_error');

module.exports = (app) => {
  const router = express.Router();

  router.post('/signin', (req, res, next) => {
    app.services.user
      .findOne({ email: req.body.email })
      .then((user) => {
        if (!user) throw new ValidateError('Usuário ou senha inválidos');

        if (bcrypt.compareSync(req.body.password, user.password)) {
          const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
          };
          const token = jwt.encode(payload, process.env.SECRET);

          return res.status(200).json({ token });
        } else throw new ValidateError('Usuário ou senha inválidos');
      })
      .catch((error) => next(error));
  });

  router.post('/signup', (req, res, next) => {
    return app.services.user
      .save(req.body)
      .then((result) => res.status(201).json(result[0]))
      .catch((error) => next(error));
  });

  return router;
};
