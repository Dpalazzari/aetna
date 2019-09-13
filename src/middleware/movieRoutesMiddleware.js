const util = require('util');
const { formatResponse } = require('../helpers/helpers');

const moviesValidator = (req, res, next) => {
  util.log('Validating Parameters.');
  const resObj = formatResponse();
  const page = req.query.page;
  const year = req.query.year;
  // year param validations
  if (year) {
    if (year.length !== 4 || !Number.isInteger(parseInt(year))) {
      resObj.data = `${year} is not a valid year.`
      res.status(400).send(resObj);
    }
  }
  // page param validations
  if (page) {
    if (!Number.isInteger(parseInt(page))) {
      resObj.data = `${page} is not a valid page number.`
      res.status(422).send(resObj);
    }
  } else if (!page && !req.params.id) {
    resObj.data = `Please provide a valid page number with the page= query.`;
    res.status(400).send(resObj);
  }
  next();
}

const movieValidator = (req, res, next) => {
  const movieId = parseInt(req.params.id);
  const resObj = formatResponse();
  if (!Number.isInteger(movieId)) {
    resObj.data = `Movie not found by ID ${req.params.id}.`;
    res.status(404).send(resObj);
  }
  next();
}

module.exports = {
  moviesValidator, movieValidator
}