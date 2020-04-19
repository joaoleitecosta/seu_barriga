module.exports = (app) => {
  const findAll = (req, res) => {
    app
      .db('users')
      .select()
      .then((result) => res.status(200).json(result));
    // res.status(200).json(users);
  };

  const create = async (req, res) => {
    const user = await app.db('users').insert(req.body, '*');
    res.status(201).json(user[0]);
  };

  return { findAll, create };
};
