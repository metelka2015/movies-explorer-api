require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { HTTP_STATUS_OK } = require('http2').constants;

const { NODE_ENV, JWT_SECRET } = process.env;
const UnauthorizedError = require('../utils/errors/unauthtorizedError');
const userModel = require('../models/user');

const login = (req, res, next) => {
  const { email, password } = req.body;
  userModel.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Пользователь не найден');
      }
      return bcrypt.compare(password, user.password)
        // eslint-disable-next-line consistent-return
        .then((matched) => {
          if (!matched) {
            // хеши не совпали — отклоняем
            throw new UnauthorizedError('Неправильные почта или пароль');
          }
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
            { expiresIn: '7d' },
          );
          res.status(HTTP_STATUS_OK).send({ token });
        })
        .catch(next);
    })
    .catch(next);
};

module.exports = { login };
