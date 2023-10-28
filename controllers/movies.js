const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
} = require('http2').constants;
const movieModel = require('../models/movie');

const NotFoundError = require('../utils/errors/notFoundError');
const ForbiddenError = require('../utils/errors/forbiddenError');

// GET /movies - возвращает все сохранённые текущим пользователем фильмы

const getMovies = (req, res, next) => {
  const owner = req.user._id;
  movieModel.find({ owner })
    .then((movie) => res.status(HTTP_STATUS_OK).send(movie))
    .catch(next);
};

// POST /movies - создаёт фильм с переданными в теле

const createMovies = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    nameRU,
    nameEN,
    movieId,
  } = req.body;
  movieModel.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => res.status(HTTP_STATUS_CREATED).send(movie))
    .catch(next);
};

// DELETE /movies/_id - удаляет сохранённый фильм по id

const deleteMovieById = (req, res, next) => {
  const { movieId } = req.params;
  return movieModel.findById(movieId)
    .orFail(() => {
      throw new NotFoundError('Фильм не найден');
    })
    .then((movie) => {
      if (`${movie.owner}` !== req.user._id) {
        throw new ForbiddenError('Вы не можете удалить этот фильм');
      }
      movieModel.findByIdAndRemove(movieId)
        .orFail(() => {
          throw new NotFoundError('Фильм не найден');
        })
        .then(() => {
          res.status(HTTP_STATUS_OK).send(movie);
        })
        .catch(next);
    })
    .catch(next);
};

module.exports = {
  getMovies,
  createMovies,
  deleteMovieById,
};
