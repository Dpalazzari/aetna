"use strict";
const util = require('util');
const { requestor, averageRating } = require('../helpers/helpers');
const sqlite3 = require('sqlite3').verbose();
const { Rating } = require('../db/rating');
const omdbUrl = 'https://www.omdbapi.com/?apikey=ceb9bf8c&i='

class Movie{
  constructor(page, year){
    this.page = page;
    this.year = year;
    this.db = new sqlite3.Database('./db/movies.db', sqlite3.OPEN_READONLY, (err) => {
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

  getMovies(){
    return new Promise((resolve, reject) => {
      let offset = (this.page * 50) - 50
      let limit = 50;
      let query = 'SELECT imdbId, title, genres, releaseDate, budget  FROM movies'
      let sql = (this.year)
        ? `${query} WHERE releaseDate LIKE '%${this.year}%' LIMIT ${limit} OFFSET ${offset}`
        : `${query} LIMIT ${limit} OFFSET ${offset}`;
      this.db.all(sql, [], (err, rows) => {
        if (err) {
          util.log(`ERROR: ${err.message}`);
          reject(err);
        }
        resolve(rows);
      })
    })
  }

  getMovie(id){
    return new Promise((resolve, reject) => {
      let query = 'SELECT imdbId, title, overview, releaseDate, budget, runtime, genres, language, productionCompanies FROM movies'
      let sql = `${query} WHERE movieId = ${id}`;
      this.db.get(sql, [], (err, row) => {
        if (err) {
          util.log(`ERROR: ${err.message}`);
          reject(err);
        }
        let url = `${omdbUrl}${row.imdbId}`
        requestor(url).then(data => {
          row.ratings = {
            "db": null,
            "metascore": data.Metascore,
            "imdb": data.imdbRating
          }
          resolve(row);
        }).catch(err => {
          util.log(`ERROR: ${err}`);
          reject(`ERROR: ${err}`)
        })
      })
    })
  }

  closeDb(){
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
  Movie,
}