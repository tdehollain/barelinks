
// Modules ================================================
const express = require('express');
const router = express.Router();
const path = require('path');
const mongoose = require('mongoose');
// const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();

// Config =================================================
const db = require("./db")(mongoose);
mongoose.connect(db.url);

// uncomment after placing your favicon in /public
//app.use(favicon(dirname + '/public/favicon.ico'));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/', router);
app.set('view engine', 'pug');

// Routes =================================================
require("./routes")(router, db);

app.listen(8001);