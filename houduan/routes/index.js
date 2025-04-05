var express = require('express');
var router = express.Router();
var fs = require('fs')
var multiparty = require('multiparty');
var xlsx = require("node-xlsx").default;
const jwt = require('jsonwebtoken');
const {peopleModel}  = require('../db/index')
/* GET home page. */


//获取数据
router.get('/people', async function(req, res, next) {
    let data = await peopleModel.find()
    res.send({
        code:200,
        data:data
    })

});


module.exports = router;
