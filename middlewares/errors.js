// eslint-disable-next-line linebreak-style
const conflictError = require('../utils/errors/conflictError');
const validationError = require('../utils/errors/validationError');

const handleError = (err, req, res, next) => {
  if (err.name === 'NotFoundError') {
    res.status(err.statusCode).send({ message: err.message });
    return;
  }

  if (err.name === 'ValidationError' || err.name === 'CastError') {
    res
      .status(validationError.statusCode)
      .send({ message: validationError.message });
    return;
  }

  if (err.code === 11000) {
    res.status(conflictError.statusCode).send({ message: conflictError.message });
    return;
  }

  if (err.name === 'ForbiddenError') {
    res.status(err.statusCode).send({ message: err.message });
    return;
  }

  if (err.name === 'UnauthorizedError') {
    res.status(err.statusCode).send({ message: err.message });
    return;
  }

  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
};

module.exports = handleError;
