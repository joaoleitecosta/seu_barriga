module.exports = (app) => {
  const create = (req, res) =>
    // const result = await app.services.account.save(req.body);
    // return res.status(201).json(result[0]);

    app.services.account
      .save(req.body)
      .then((result) => res.status(201).json(result[0]));

  const findAll = (req, res) =>
    app.services.account
      .findAll()
      .then((result) => res.status(200).json(result));

  const findById = (req, res) =>
    app.services.account
      .findById({ id: req.params.id })
      .then((result) => res.status(200).json(result));

  return { create, findAll, findById };
};
