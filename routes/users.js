const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { regEmail } = require('../utils/constants');

const {
  updateUserById,
  getCurrentUser,
} = require('../controllers/users');

router.get('/me', getCurrentUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(regEmail),
    name: Joi.string().required().min(2).max(30),
  }),
}), updateUserById);

module.exports = router;
