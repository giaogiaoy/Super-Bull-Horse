<<<<<<< HEAD
var express = require('express');
var router = express.Router();
var fs = require('fs')
var multiparty = require('multiparty');
var xlsx = require("node-xlsx").default;
const jwt = require('jsonwebtoken');
const {peopleModel,ReportModel}  = require('../db/index')
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

//获取维修报备信息
router.get('/report',async(req,res)=>{
    const page = req.query.page
    const pageSize = req.query.pageSize
    const sou = {}
    const name = req.query.name
    const ID = req.query.ID
    const status = req.query.status
    if(name){
        sou.name = new RegExp(name)
    }
    if(ID){
        sou.ID = ID
    }
    if(status){
        sou.status = status
    }
    let data = await ReportModel.find(sou).skip((page-1)*pageSize).limit(pageSize)
    let total = await ReportModel.find(sou).countDocuments()
    res.send({
        code:200,
        data:data,
        total:total
    })
})
//点击验收通过
router.post('/accept',async(req,res)=>{
    let {_id,status} = req.body.info
    
    await ReportModel.updateOne({_id:_id},{$set:{status:!status}})
    res.send({
        code:200,
        msg:'验收成功'
    })
})
//
=======

var express = require('express');
var router = express.Router();
var { juesemodel, luyoumodel, yonghumodel } = require('../MGdb/mgdb');
var jwt = require('jsonwebtoken');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

const Dysmsapi20170525 = require('@alicloud/dysmsapi20170525');
const OpenApi = require('@alicloud/openapi-client');
const Util = require('@alicloud/tea-util');
const Tea = require('@alicloud/tea-typescript');
let accessKeyIds = ''
let accessKeySecrets = ''
//用户角色管理
router.post("/phone", async (req, res) => {
  let codes = req.body.code;
  let phone = req.body.phone;
  class Client {

    /**
     * 使用AK&SK初始化账号Client
     * @return Client
     * @throws Exception
     */
    static createClient() {
      // 工程代码泄露可能会导致 AccessKey 泄露，并威胁账号下所有资源的安全性。以下代码示例仅供参考。
      // 建议使用更安全的 STS 方式，更多鉴权访问方式请参见：https://help.aliyun.com/document_detail/378664.html。
      let config = new OpenApi.Config({
        accessKeyId: process.env.ACCESS_KEY_ID,
        accessKeySecret: process.env.ACCESS_KEY_SECRET
        // regionId: 'cn-hangzhou',
      });
      // Endpoint 请参考 https://api.aliyun.com/product/Dysmsapi
      config.endpoint = `dysmsapi.aliyuncs.com`;
      return new Dysmsapi20170525.default(config);
    }


    static async main(args) {
      let client = Client.createClient();
      let sendSmsRequest = new Dysmsapi20170525.SendSmsRequest({
        signName: '阿里云短信测试',
        templateCode: 'SMS_154950909',
        phoneNumbers: phone,
        templateParam: `{"code":${codes}`,
      });
      let runtime = new Util.RuntimeOptions({});
      try {
        // 复制代码运行请自行打印 API 的返回值
        await client.sendSmsWithOptions(sendSmsRequest, runtime);
      } catch (error) {
        // 此处仅做打印展示，请谨慎对待异常处理，在工程项目中切勿直接忽略异常。
        // 错误 message
        console.log(error.message);
        // 诊断地址
        console.log(error.data["Recommend"]);
        Util.default.assertAsString(error.message);
      }
    }

  }
  exports.Client = Client;
  Client.main(process.argv.slice(2));

  res.send({
    code: 200,
    msg: '验证码发送成功'
  })
})
//登录
router.post("/login", async (req, res) => {
  let { phone, code, pwd } = req.body;
  console.log(req.body);

  
  let accessToken = jwt.sign({ phone }, '123456', { expiresIn: '3h' });
  let refreshToken = jwt.sign({ phone }, '123456', { expiresIn: '7d' });
  res.send({
    code: 200,
    accessToken,
    refreshToken,
  })
})
//获取用户信息
router.get("/userinfo", async (req, res) => {
 let accesstoken = req.headers.accesstoken
 let token = jwt.verify(accesstoken,'123456')
 try{
  let data = await yonghumodel.findOne({ phone:token.phone }).populate('role_id')
  console.log(data.role_id);
  //根据用户角色查询权限查新路由
  let arr =[]
  for (let i = 0; i < data.role_id.length; i++) {
      console.log();
      for(let j=0;j<data.role_id[i].urls.length;j++){
         let a = await luyoumodel.findOne({_id:data.role_id[i].urls[j]})
         arr.push(a)
      }
  }

  res.send({
    code:200,
    msg:'获取用户信息成功',
    data,
    arr
  })
 }catch(err){
  res.send({
    code:500,
    msg:'获取用户信息失败',
  }) 
 }
})

>>>>>>> 52709fc22957025655cc05364cd46401c4ba158f
module.exports = router;
