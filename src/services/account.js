module.exports = (app) => {
  const save = async (account) => {
    if (!account.name) return { error: 'Nome é um atributo obrigatório' };

    return app.db('accounts').insert(account, '*');
  };

  const findAll = () => app.db('accounts').select();

  const findById = (filter = {}) => {
    return app.db('accounts').where(filter).first();
  };

  const update = (id, account) =>
    app.db('accounts').where({ id }).update(account, '*');

  const remove = (filter = {}) => app.db('accounts').where(filter).delete();

  return { save, findAll, findById, update, remove };
};
