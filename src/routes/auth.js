require('dotenv').config();
const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');

module.exports = (app) => {
  const signin = (req, res, next) => {
    app.services.user
      .findOne({ email: req.body.email })
      .then((user) => {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
          };
          const token = jwt.encode(payload, process.env.SECRET);

          return res.status(200).json({ token });
        }
      })
      .catch((error) => next(error));
  };

  return { signin };
};
