/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable max-len */
const bcrypt = require('bcryptjs');
const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
} = require('http2').constants;
const NotFoundError = require('../utils/errors/notFoundError');
const userModel = require('../models/user');

const SALT_ROUNDS = 10;

// GET /users/me - возвращает информацию о пользователе (email и имя)

const getCurrentUser = (req, res, next) => userModel.findById({ _id: req.user._id })
  .orFail(() => {
    throw new NotFoundError('Пользователь не найден');
  })
  .then((user) => res.status(HTTP_STATUS_OK).send({
    _id: user._id,
    name: user.name,
    email: user.email,
  }))
  .catch(next);

// PATCH /users/me - обновляет информацию о пользователе (email и имя)

const updateUserById = (req, res, next) => userModel.findByIdAndUpdate(req.user._id, { name: req.body.name, email: req.body.email }, { new: true, runValidators: true })
  .then((r) => res.status(HTTP_STATUS_OK).send(r))
  .catch(next);

// POST /signup - создаёт пользователя с переданными в теле email, password и name

const createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => {
      userModel.create({
        email, password: hash, name,
      })
        .then((user) => res.status(HTTP_STATUS_CREATED).send({
          _id: user._id,
          email: user.email,
          name: user.name,
        }))
        .catch(next);
    })
    .catch(next);
};

module.exports = {
  updateUserById,
  createUser,
  getCurrentUser,
};
