test('Devo conhecer os principais assertivas do jest', () => {
  let number = null;
  expect(number).toBeNull();

  number = 10;

  expect(number).not.toBeNull();

  expect(number).toBe(10);
  expect(number).toEqual(10);
  expect(number).toBeGreaterThan(9); //! > 9
  expect(number).toBeLessThan(11); //! < 11
});

test('Teste com objetos', () => {
  const obj = { name: 'Joao', email: 'joao_leite@hotmail.com.br' };
  expect(obj).toHaveProperty('name', 'Joao'); //! verifica se tem a propriedade e o valor nela
  expect(obj.name).toBe('Joao');

  const obj2 = { name: 'Joao', email: 'joao_leite@hotmail.com.br' };

  expect(obj).toEqual(obj2); //! toBe não pode ser usado para comparar objetos distintos
});
