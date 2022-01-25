const httpErrorHandler = {
  badRequest: (message, res) => res.status(400).json({ message }),
  unauthorized: (message, res) => res.status(401).json({ message }),
  notFound: (message, res) => res.status(404).json({ message }),
  conflict: (message, res) => res.status(409).json({ message }),
  unprocessableEntity: (message, res) => res.status(422).json({ message }),
  undefined: (_message, res) => res.status(500).json({ message: 'Internal Server Error' }),
};

module.exports = async (err, _req, res, _next) => {
  if (err.isJoi) {
    const { message, context: { key } } = err.details[0];

    if (key === 'cpf') {
      return httpErrorHandler.unprocessableEntity(
        'The CPF must be in the format XXX.XXX.XXX-XX',
        res,
      );
    }

    if (key === 'phone') return httpErrorHandler.unprocessableEntity('Incorrect phone format', res);

    return httpErrorHandler.badRequest(message, res);
  }

  // if (err.sql) {
  //   console.log(err);

  //   return res.status(400).json(err);
  // }

  return httpErrorHandler[err.httpCode](err.message, res);
};
