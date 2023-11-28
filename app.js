const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');

const indexRouter = require('./routes/index');

const app = express();

app.use(logger('dev'));

app.use(bodyParser.json());

app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);

module.exports = app;
