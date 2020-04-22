const ValidationError = require('../erros/validation_error');
module.exports = (app) => {
  const findAll = (user_id) => {
    return app.db('accounts').where({ user_id });
  };

  const find = (filter = {}) => {
    return app.db('accounts').where(filter).first();
  };
  const save = async (account) => {
    if (!account.name)
      throw new ValidationError('Nome é um atributo obrigatório');

    const accountDb = await find({
      user_id: account.user_id,
      name: account.name,
    });

    if (accountDb)
      throw new ValidationError('Já existe uma conta com esse nome');

    return app.db('accounts').insert(account, '*');
  };

  const update = (id, account) =>
    app.db('accounts').where({ id }).update(account, '*');

  const remove = (filter = {}) => app.db('accounts').where(filter).delete();

  return { save, findAll, find, update, remove };
};
