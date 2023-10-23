/* eslint-disable linebreak-style */
const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const { auth } = require('../middlewares/auth');
const NotFoundError = require('../utils/errors/notFoundError');

router.use('/users', auth, userRouter);
router.use('/movies', auth, movieRouter);
router.use('*', (req, res, next) => {
  next(new NotFoundError('Page not found'));
});

module.exports = router;
