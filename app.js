const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
const cors       = require('cors');
const morgan     = require('morgan');
const util       = require('util');
const routes     = require('./src/routes');

// cors
let corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// logging
if (process.env.NODE_ENV !== 'test'){
  app.use(morgan('dev'));
}

// bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json' })); 

app.listen(9292, () => {
  util.log('Listening on port 9292.');
});

// init routes
routes(app);

module.exports = app;