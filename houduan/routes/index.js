var express = require('express');
var router = express.Router();
var { CAModel } = require('../MGdb/mgdb');
var { jwt } = require('jsonwebtoken');

// 获取活动
router.get('/getCAlist', async(req, res) => {
  let { page, size } = req.query;
  let data = await CAModel.find()
  .limit(Number(size))
  .skip((Number(page) - 1) * Number(size));

  let total = await CAModel.countDocuments();
  
  res.send({
    code: 200,
    msg: '获取成功',
    data,
    total
  })
});


module.exports = router;
