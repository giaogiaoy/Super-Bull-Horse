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

// 新增活动
router.post('/addCA', async(req, res) => {
  
})

// 删除活动
router.post('/deleteCA', async(req, res) => {
  
})

// 修改活动
router.post('/updateCA', async(req, res) => {
  
})

// 审核活动
router.post('/reviewCA', async(req, res) => {
  
})

// 强制结束活动
router.post('/forceEndCA', async(req, res) => {
  
})




module.exports = router;
