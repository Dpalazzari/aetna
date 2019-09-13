const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const should = chai.should();
const util = require('util');
chai.use(chaiHttp);

describe('MOVIES', () => {
  describe('/GET movies', () => {
    it('it should GET all the movies for page 4', (done) => {
      chai.request(app)
        .get('/api/v1/movies?page=4')
        .end((err, res) => {
          if (err) util.log(`TEST ERROR: ${err}`)
          res.should.have.status(200);
          res.body.dataCount.should.be.eql(50)
          res.body.data.should.be.a('array');
          let budget = res.body.data[0].budget;
          budget[0].should.be.eql('$')
          keys = Object.keys(res.body.data[0])
          keys.should.include('imdbId')
          keys.should.include('title')
          keys.should.include('genres')
          keys.should.include('releaseDate')
          keys.should.include('budget')
          done();
        });
    });

    it('it should ERROR when page parameter is missing', (done) => {
      chai.request(app)
        .get('/api/v1/movies?year=1994')
        .end((err, res) => {
          if (err) util.log(`TEST ERROR: ${err}`)
          res.should.have.status(400)
          res.body.data.should.be.eql('Please provide a valid page number with the page= query.')
          done()
        })
    })

    it('it should NOT return any data for year 199', (done) => {
      chai.request(app)
        .get('/api/v1/movies?year=199&page=1')
        .end((err, res) => {
          if (err) util.log(`TEST ERROR: ${err}`)
          res.should.have.status(400)
          res.body.data.should.be.eql('199 is not a valid year.')
          done()
      })
    })

    it('it should return 50 movies from the year 1996', (done) => {
      chai.request(app)
        .get('/api/v1/movies?year=1996&page=1')
        .end((err, res) => {
          if (err) util.log(`TEST ERROR: ${err}`)
          res.should.have.status(200);
          res.body.dataCount.should.be.eql(50)
          res.body.data.should.be.a('array');
          const movies = res.body.data;
          // make sure every movie matches query parameter
          for (movie of movies){
            let date = movie.releaseDate.split('-')[0]
            date.should.be.eql('1996');
          }
          done()
      })
    })
  });

  describe('GET /movie', () =>{
    it('it should GET all the Columns for Movie 198', (done) => {
      chai.request(app)
        .get('/api/v1/movies/198')
        .end((err, res) => {
          if (err) util.log(`TEST ERROR: ${err}`)
          res.should.have.status(200);
          res.body.data.should.be.a('object');
          let budget = res.body.data.budget;
          budget[0].should.be.eql('$')
          keys = Object.keys(res.body.data)
          keys.should.include('imdbId')
          keys.should.include('title')
          keys.should.include('genres')
          keys.should.include('releaseDate')
          keys.should.include('budget')
          keys.should.include('overview')
          keys.should.include('ratings')
          keys.should.include('productionCompanies')
          keys.should.include('language')
          done();
        })
    })

    it('it should NOT GET any data for movie ID foo', (done) => {
      chai.request(app)
        .get('/api/v1/movies/foo')
        .end((err, res) => {
          if (err) util.log(`TEST ERROR: ${err}`)
          res.should.have.status(404);
          res.body.data.should.be.eql('Movie not found by ID foo.');
          done()
        })
    })
  })
});

