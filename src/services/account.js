const ValidationError = require('../erros/validation_error');
module.exports = (app) => {
  const save = async (account) => {
    if (!account.name)
      throw new ValidationError('Nome é um atributo obrigatório');

    return app.db('accounts').insert(account, '*');
  };

  const findAll = (user_id) => {
    return app.db('accounts').where({ user_id });
  };

  const findById = (filter = {}) => {
    return app.db('accounts').where(filter).first();
  };

  const update = (id, account) =>
    app.db('accounts').where({ id }).update(account, '*');

  const remove = (filter = {}) => app.db('accounts').where(filter).delete();

  return { save, findAll, findById, update, remove };
};
