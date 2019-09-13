"use strict";
const util = require('util');
const sqlite3 = require('sqlite3').verbose();

class Rating{
  constructor(movieId){
    this.movieId = movieId;
    this.db = new sqlite3.Database('./db/ratings.db', sqlite3.OPEN_READONLY, (err) => {
      if (err) {
        util.log(`ERROR: ${err.message}`);
      }
    })
    // this.schema = this.db.serialize(() => {
    //   this.db.all("SELECT * FROM sqlite_master WHERE type='table'", (err, tables) => {
    //     util.log(tables)
    //   })
    // })
  }

  getRatingsByMovieId(){
    return new Promise((resolve, reject) => {
      let sql = `SELECT * FROM ratings WHERE movieId = ${this.movieId}`;
      this.db.all(sql, [], (err, rows) => {
        if (err) {
          util.log(`ERROR: ${err.message}`);
          reject(err);
        }
        resolve(rows);
      })
    })
  }

  getAverageRatingsByMovieId(){
    return this.getRatingsByMovieId().then(ratings => {
      const ratingsCount = ratings.length;
      let totalRating = 0;
      ratings.forEach((rating) => {
        totalRating += rating.rating;
      })
      let num = totalRating / ratingsCount;
      return Number(num.toFixed(1))
    }).catch(err => {

    })
  }

  closeDb() {
    return new Promise((resolve, reject) => {
      this.db.close(err => {
        if (err) {
          util.log(`ERROR: ${err.message}`);
          reject(err);
        }
        util.log('Database connection closed.');
        resolve();
      })
    })
  }
}

module.exports = {
  Rating
}