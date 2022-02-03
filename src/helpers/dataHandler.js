// Recebe um objeto com chaves que não se sabe se ou quais estão undefined e retorna outro objeto
// somente com as chaves que contêm algum valor

const getObjectWithOnlyDefinedValues = (obj) => Object.values(obj).reduce((acc, curr, index) => {
  if (curr) {
    acc[Object.keys(obj)[index]] = curr;
  }
  return acc;
}, {});

module.exports = {
  getObjectWithOnlyDefinedValues,
};
