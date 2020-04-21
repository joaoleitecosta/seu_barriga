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

  const update = (req, res) =>
    app.services.account
      .update(req.params.id, req.body)
      .then((result) => res.status(200).json(result[0]));

  const remove = (req, res) =>
    app.services.account
      .remove({ id: req.params.id })
      .then(() => res.status(204).send());

  return { create, findAll, findById, update, remove };
};
