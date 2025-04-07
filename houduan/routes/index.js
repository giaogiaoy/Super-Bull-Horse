var express = require('express');
var router = express.Router();
var fs = require('fs')
var multiparty = require('multiparty');
var xlsx = require("node-xlsx").default;
const jwt = require('jsonwebtoken');
const {peopleModel}  = require('../db/index')
const path = require('path')
/* GET home page. */


//获取数据
router.get('/people', async function(req, res, next) {
    const page = req.query.page
    const pageSize = req.query.pageSize
    const sou = {}
    const name = req.query.name
    const ID = req.query.ID
    if(name){
        sou.name = new RegExp(name)
    }
    if(ID){
        sou.ID = ID
    }
    let data = await peopleModel.find(sou).skip((page-1)*pageSize).limit(pageSize)
    let total = await peopleModel.find(sou).countDocuments()
    res.send({
        code:200,
        data:data,
        total:total
    })
});

//删除关怀人员信息
router.get('/delete', async function(req, res, next) {
    
    let id = req.query.id
    console.log(req.query.id);
    await peopleModel.deleteOne({_id:id})
    res.send({
        code:200    
    })

});
//添加关怀人员信息
router.post('/add', async function(req, res, next) {
    await peopleModel.create(req.body)
    res.send({
        code:200    
    })
});
//更新关怀人员信息
router.post('/updates', async function(req, res, next) {
    let id = req.body.IDS
    console.log(id);
    // delete req.body.id
    await peopleModel.updateOne({_id:id},req.body)
    res.send({
        code:200    
    })
});
//批量删除
router.post('/deleteBatch', async function(req, res, next) {
    let ids = req.body.ids
    console.log(ids);
    await peopleModel.deleteMany({_id:{$in:ids}})
    res.send({
        code:200    
    })
});
//添加图片
router.post('/upload', (req, res) => {
    const uploadDir = path.join(__dirname, '../upload')
   console.log(uploadDir);
    console.log(11111);
    const form = new multiparty.Form({ uploadDir });
    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(500).json({ code: 500, message: '文件解析失败' });
      }
      // 获取上传的文件对象
      const file = files.file[0]; // 假设前端字段名是'file'
      
      // 生成新的文件名（避免覆盖）
      const ext = path.extname(file.originalFilename);
      const newFilename = `${Date.now()}${ext}`;
      const newPath = path.join(uploadDir, newFilename);
      // 重命名文件
      fs.rename(file.path, newPath, (err) => {
        if (err) {
          return res.status(500).json({ code: 500, message: '文件保存失败' });
        }
        // 返回访问URL (确保你的Express配置了静态文件服务)
        const fileUrl = `http://localhost:3000/upload/${newFilename}`;
        console.log(fileUrl);
        res.json({ code: 200, url: fileUrl });
      });
    });
  });
module.exports = router;
