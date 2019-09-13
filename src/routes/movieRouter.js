"use strict";
const util = require('util');
const { Movie } = require('../db/movie');
const { Rating } = require('../db/rating');
const { formatResponse, formatBudgetValues, averageRating } = require('../helpers/helpers');

// ceb9bf8c

module.exports = (app) => {
  app.get('/api/v1/movies', async (req, res) => {
    const resObj = formatResponse();
    const page = req.query.page;
    const year = req.query.year;
    let movie = new Movie(page, year);
    // year param validations
    if (year){
      if (year.length !== 4 || !Number.isInteger(parseInt(year))){
        resObj.data = `${year} is not a valid year.`
        res.status(400).send(resObj);
      }
    }
    // page param validations
    if (page){
      if (!Number.isInteger(parseInt(page))){
        resObj.data = `${page} is not a valid page number.`
        res.status(422).send(resObj);
      }
    } else {
      resObj.data = `Please provide a valid page number with the page= query.`;
      res.status(400).send(resObj);
    }
    try {
      const movieData = formatBudgetValues(await movie.getMovies());
      resObj.dataCount = movieData.length;
      resObj.data = movieData;
      res.status(200).send(resObj);
    } catch(err){
      util.log(`ERROR: ${err}`);
    }
    
  })

  app.get('/api/v1/movies/:id', async (req, res) => {
    const movieId = parseInt(req.params.id);
    const resObj = formatResponse();
    if (!Number.isInteger(movieId)){
      resObj.data = `Movie not found by id ${req.params.id}`;
      res.status(404).send(resObj);
    }
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