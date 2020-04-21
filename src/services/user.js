const bcrypt = require('bcrypt-nodejs');
const ValidationError = require('../erros/validation_error');

module.exports = (app) => {
  const findAll = () => {
    return app.db('users').select(['id', 'name', 'email']);
  };

  const getPassWdHash = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  };

  const save = async (user) => {
    if (!user.name) throw new ValidationError('Nome é um campo obrigatório');
    if (!user.email) throw new ValidationError('Email é um campo obrigatório');
    if (!user.password)
      throw new ValidationError('Senha é um campo obrigatório');

    const userDb = await findOne({ email: user.email });

    if (userDb)
      throw new ValidationError('Já existe um usuário com esse email');

    const newUser = { ...user };

    newUser.password = getPassWdHash(user.password);
    return app.db('users').insert(newUser, ['id', 'name', 'email']);
  };

  const findOne = async (filter = {}) => {
    const user = await app.db('users').where(filter).first();
    return user;
  };

  return { findAll, save, findOne };
};
