//const ValidationError = require('../erros/validation_error');

const express = require('express');
module.exports = (app) => {
  const router = express.Router();

  router.post('/', (req, res, next) => {
    app.services.account
      .save({ ...req.body, user_id: req.user.id })
      .then((result) => {
        return res.status(201).json(result[0]);
      })
      .catch((error) => next(error));
  });

  router.get('/', (req, res, next) =>
    app.services.account
      .findAll(req.user.id)
      .then((result) => res.status(200).json(result))
      .catch((error) => next(error))
  );

  router.get('/:id', (req, res, next) =>
    app.services.account
      .find({ id: req.params.id })
      .then((result) => {
        if (result.user_id !== req.user.id)
          res
            .status(403)
            .json({ error: 'Esse recurso não pertence ao usuário' });
        res.status(200).json(result);
      })
      .catch((error) => next(error))
  );

  router.put('/:id', (req, res, next) =>
    app.services.account
      .update(req.params.id, req.body)
      .then((result) => res.status(200).json(result[0]))
      .catch((error) => next(error))
  );

  router.delete('/:id', (req, res, next) =>
    app.services.account
      .remove({ id: req.params.id })
      .then(() => res.status(204).send())
      .catch((error) => next(error))
  );

  return router;
};
