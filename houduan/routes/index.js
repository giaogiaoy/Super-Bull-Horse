
var express = require('express');
var router = express.Router();
var { juesemodel,luyoumodel,yonghumodel } = require('../MGdb/mgdb');
var jwt = require('jsonwebtoken');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const Dysmsapi20170525 = require('@alicloud/dysmsapi20170525');
const OpenApi = require('@alicloud/openapi-client');
const Util = require('@alicloud/tea-util');
const Tea = require('@alicloud/tea-typescript');
let accessKeyIds = ''
let accessKeySecrets = ''
//用户角色管理
router.post("/phone", async (req,res)=>{
  let codes= req.body.code;
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
    let runtime = new Util.RuntimeOptions({ });
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
  code:codes
})
})

router.post("/login",async(req,res)=>{
    let {phone,code,pwd} = req.body;
    console.log(phone,code,pwd);
    
    if(code){
      let data = await juesemodel.findOne({phone:phone});
      console.log(data);
      if(data){
          let accessToken = jwt.sign({phone},'123456',{expiresIn:'1h'});
          let refreshToken = jwt.sign({phone},'123456',{expiresIn:'7d'});
          res.send({
            code:200,
            data,
            accessToken,
            refreshToken,
          }) 
      }
      
    }else{
      let data = await yonghumodel.findOne({phone:phone,password:pwd});
      if(data){
        let accessToken = jwt.sign({phone},'123456',{expiresIn:'1h'});
        let refreshToken = jwt.sign({phone},'123456',{expiresIn:'7d'});        
        res.send({
          code:200,
          data,
          accessToken,
          refreshToken,
         })
      }
    }
})

module.exports = router;
