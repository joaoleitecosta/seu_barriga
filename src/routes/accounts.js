module.exports = (app) => {
  const create = (req, res) => {
    // const result = await app.services.account.save(req.body);
    // return res.status(201).json(result[0]);

    app.services.account
      .save(req.body)
      .then((result) => res.status(201).json(result[0]));
  };

  return { create };
};
