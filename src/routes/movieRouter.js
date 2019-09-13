"use strict";
const util = require('util');
const { Movie } = require('../db/movie');
const { Rating } = require('../db/rating');
const { formatResponse, formatBudgetValues } = require('../helpers/helpers');
const { moviesValidator, movieValidator } = require('../middleware/movieRoutesMiddleware');
const resObj = formatResponse();

// ceb9bf8c

module.exports = (app) => {

  app.get('/api/v1/movies', moviesValidator, async (req, res) => {
    const page = req.query.page;
    const year = req.query.year;
    let movie = new Movie(page, year);
    try {
      const movieData = formatBudgetValues(await movie.getMovies());
      resObj.dataCount = movieData.length;
      resObj.data = movieData;
      res.status(200).send(resObj);
    } catch(err){
      util.log(`ERROR: ${err}`);
    } 
  })

  app.get('/api/v1/movies/:id', movieValidator, async (req, res) => {
    const movieId = parseInt(req.params.id);
    try {
      const movie = new Movie();
      const movieData = await movie.getMovie(movieId);
      if (movieData) {
        const ratings = new Rating(movieId);
        const average = await ratings.getAverageRatingsByMovieId();
        movieData.ratings.db = average;
        const budget = `$${movieData.budget.toLocaleString()}.00`
        movieData.budget = budget;
        resObj.data = movieData;
        res.status(200).send(resObj);
      } else {
        resObj.data = `Movie not found with ID ${movieId}`
        res.status(404).send(resObj);
      }
    } catch(err) {
      util.log(`ERROR: ${err}`)
    }
  })
}