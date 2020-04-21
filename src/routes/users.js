module.exports = (app) => {
  const findAll = (req, res, next) => {
    return app.services.user
      .findAll()
      .then((result) => res.status(200).json(result))
      .catch((error) => next(error));
  };

  const create = async (req, res, next) => {
    return app.services.user
      .save(req.body)
      .then((result) => res.status(201).json(result[0]))
      .catch((error) => next(error));
  };

  return { findAll, create };
};
