const httpErrorHandler = {
  badRequest: (message, res) => res.status(400).json({ message }),
  unauthorized: (message, res) => res.status(401).json({ message }),
  notFound: (message, res) => res.status(404).json({ message }),
  conflict: (message, res) => res.status(409).json({ message }),
  unprocessableEntity: (message, res) => res.status(422).json({ message }),
  undefined: (_message, res) => res.status(500).json({ message: 'Internal Server Error' }),
};

const specificJoiErrors = {
  cpf: (res, httpCode) =>
    httpErrorHandler[httpCode]('The CPF must be in the format XXX.XXX.XXX-XX', res),
  phone: (res, httpCode) =>
    httpErrorHandler[httpCode]('Incorrect phone format', res),
  role: (res, httpCode) =>
    httpErrorHandler[httpCode]('role must be user or admin', res),
};

module.exports = async (err, _req, res, _next) => {
  if (err.isJoi) {
    const { message, context: { key } } = err.details[0];

    if (specificJoiErrors[key]) return specificJoiErrors[key](res, 'unprocessableEntity');

    return httpErrorHandler.badRequest(message, res);
  }

  console.log(err.message);
  return httpErrorHandler[err.httpCode](err.message, res);
};
