module.exports = app => {
  /**
   * This is where we can load all our routes
   * Makes it easier to initiate routes without cluttering up app.js
   */
  const ekgrouter = require('./routes/ekgRouter');
  const movieRouter = require('./routes/movieRouter');

  ekgrouter(app);
  movieRouter(app);
}