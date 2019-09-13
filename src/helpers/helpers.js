const request = require('request-promise');

const requestor = (url) => {
  return new Promise((resolve, reject) => {
    request(url)
      .then(res => {
        resolve(JSON.parse(res))
      })
      .catch(err => reject(err))
  })
}

const formatResponse = () => {
  const pkg = require('../../package.json');
  let obj = {};
  obj.name = 'Movie API';
  obj.version = pkg.version;
  obj.data = null;
  return obj;
}

const formatBudgetValues = (data) => {
  for (movie of data) {
    budget = `$${movie.budget.toLocaleString()}.00`;
    movie.budget = budget;
  }
  return data;
}

const averageRating = (ratings) => {
  const ratingsCount = ratings.length;
  let totalRating = 0;
  for (rating of ratings){
    totalRating += rating.rating;
  }
  let num = totalRating / ratingsCount
  return Number(num.toFixed(1))
}


module.exports = {
  formatResponse, formatBudgetValues, averageRating, requestor
}