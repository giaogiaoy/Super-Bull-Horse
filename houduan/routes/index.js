var express = require('express');
var router = express.Router();
var {  } = require('../MGdb/mgdb');
var { jwt } = require('jsonwebtoken');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
