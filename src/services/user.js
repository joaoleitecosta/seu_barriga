module.exports = (app) => {
  const findAll = () => {
    return app.db('users').select();
  };

  const save = (user) => {
    if (!user.name) return { error: 'Nome é um campo obrigatório' };
    if (!user.email) return { error: 'Email é um campo obrigatório' };
    if (!user.password) return { error: 'Senha é um campo obrigatório' };
    return app.db('users').insert(user, '*');
  };

  return { findAll, save };
};
