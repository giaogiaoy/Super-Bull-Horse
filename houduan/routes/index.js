var express = require("express");
var router = express.Router();
var { CAModel,peopleModel,ReportModel,TravelrecordModel,juesemodel, luyoumodel, yonghumodel } = require("../MGdb/mgdb");
const path = require("path");
const fs = require("fs-extra");
const multer = require("multer");
const crypto = require("crypto");
var multiparty = require('multiparty');
var xlsx = require("node-xlsx").default;
const jwt = require('jsonwebtoken');

// 文件存储配置
const UPLOAD_DIR = path.resolve(process.cwd(), "uploads");
const TEMP_DIR = path.join(UPLOAD_DIR, "temp");
const FINAL_DIR = path.join(UPLOAD_DIR, "final");

// 确保目录存在
fs.ensureDirSync(TEMP_DIR);
fs.ensureDirSync(FINAL_DIR);

// 获取活动
router.get("/getCAlist", async (req, res) => {
  let { page, size, activename, singupstate, activestate, reviewstate } = req.query;
  const now = new Date();
  
   // 查询条件映射
   const queryMap = {
    // 活动名称
    activename: () => activename ? { activeName: { $regex: activename, $options: 'i' } } : {},
    
    // 报名状态映射
    singupstate: {
      '未发布': { singupState: { $gt: now } },
      '报名中': { 
        $and: [
          { singupState: { $lte: now } },
          { singupEnd: { $gt: now } },
          { isEnd: { $ne: true } }
        ]
      },
      '报名结束': { 
        $or: [
          { singupEnd: { $lte: now } },
          { isEnd: true }
        ]
      }
    },
    
    // 活动状态映射
    activestate: {
      '未开始': { activeState: { $gt: now } },
      '进行中': { 
        $and: [
          { activeState: { $lte: now } },
          { activeEnd: { $gt: now } }
        ]
      },
      '已结束': { activeEnd: { $lte: now } }
    },
    
    // 审核状态映射
    reviewstate: {
      '审核中': { ReviewerState: 1 },
      '已通过': { ReviewerState: 2 },
      '已驳回': { ReviewerState: 3 }
    }
  };

  // 构建查询条件
  const query = {
    ...queryMap.activename(),
    ...(singupstate && queryMap.singupstate[singupstate] || {}),
    ...(activestate && queryMap.activestate[activestate] || {}),
    ...(reviewstate && queryMap.reviewstate[reviewstate] || {})
  };
  
  let data = await CAModel.find(query)
    .limit(Number(size))
    .skip((Number(page) - 1) * Number(size));

  let total = await CAModel.countDocuments(query);

  res.send({
    code: 200,
    msg: "获取成功",
    data,
    total,
  });
});


// 新增活动
router.post("/addCA", async (req, res) => {
  await CAModel.create(req.body.data);
  res.send({
    code: 200,
    msg: "新增成功",
  })
});

// 删除活动
router.post("/deleteCA", async (req, res) => {
  let { id } = req.body.data;
  await CAModel.deleteOne({
    _id: id,
  });
  res.send({
    code: 200,
    msg: "删除成功",
  });
});

// 修改活动
router.post("/updateCA", async (req, res) => {
  try {
    const { _id, ...updateData } = req.body.data;
    
    await CAModel.updateOne(
      { _id },
      { $set: updateData }
    );

    res.send({
      code: 200,
      msg: "修改成功"
    });
  } catch (err) {
    console.error("修改活动错误:", err);
    res.status(500).json({
      code: 500,
      msg: "修改失败",
      error: err.message
    });
  }
});

// 审核活动
router.post("/reviewCA", async (req, res) => {});

// 强制结束活动
router.post("/forceEndCA", async (req, res) => {
  let { id } = req.body.data;
  await CAModel.updateOne({_id:id},{isEnd:true})
  res.send({
    code: 200,
    msg: "强制结束活动成功"
  });
});

// 临时分片存储
// 修改multer存储配置
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // console.log('接收分片参数:', req.body); // 新增日志
    // 添加参数校验
    if (!req.body.hash) {
      return cb(new Error("Missing file hash"), "");
    }
    const hashDir = path.join(TEMP_DIR, req.body.hash);
    // console.log('创建分片目录:', hashDir);  // 新增目录日志
    fs.ensureDirSync(hashDir);
    cb(null, hashDir);
  },
  filename: (req, file, cb) => {
    // 增强参数校验
    if (!req.body.index || !req.body.hash) {
      return cb(new Error("Invalid chunk parameters"), "");
    }
    const extension = path.extname(req.body.name || "unknown");
    cb(null, `${req.body.index}${extension}`);
  },
});
const upload = multer({ storage });

// 修改秒传验证接口
router.post("/verify", async (req, res) => {
  try {
    // 添加更严格的参数校验
    if (!req.body.hash || typeof req.body.hash !== "string") {
      return res.status(400).json({ error: "无效的哈希参数" });
    }
    if (!req.body.name || typeof req.body.name !== "string") {
      return res.status(400).json({ error: "无效的文件名参数" });
    }
    const { hash, name } = req.body;
    const filePath = path.join(FINAL_DIR, hash + path.extname(name));

    try {
      // 检查文件是否存在
      const fileExists = await fs.pathExists(filePath);
      if (fileExists) {
        return res.json({
          exists: true,
          url: `/uploads/final/${hash}${path.extname(name)}`,
        });
      }


      // 检查已上传分片并返回已上传的索引
      const chunkDir = path.join(TEMP_DIR, hash);
      let uploaded = [];

      try {
        if (await fs.pathExists(chunkDir)) {
          const chunks = await fs.readdir(chunkDir);
          uploaded = chunks
            .map((chunk) => parseInt(path.basename(chunk).split(".")[0]))
            .filter((index) => !isNaN(index))
            .sort((a, b) => a - b);
        }
      } catch (err) {
        console.error("读取分片目录错误:", err);
      }

      res.json({
        exists: false,
        uploaded: uploaded,
      });
    } catch (err) {
      console.error("验证错误:", err);
      res.status(500).json({ error: "服务器错误" });
    }
  } catch (err) {
    // 添加外层 try 的 catch
    console.error("验证请求错误:", err);
    res.status(500).json({ error: "服务器内部错误" });
  }
}); // 确保闭合大括号

// 分片上传接口
router.post(
  "/uploadactive",
  express.urlencoded({ extended: true }),
  upload.single("file"),
  async (req, res) => {
    try {
      // 如果请求被客户端取消，直接返回
      if (req.aborted) {
        return res.status(499).json({
          code: 499,
          message: "请求已取消",
        });
      }

      // 添加调试日志
      // console.log("上传参数:", {
      //   hash: req.body.hash,
      //   index: req.body.index,
      //   name: req.body.name,
      // });

      if (!req.body.hash || !req.body.index) {
        return res.status(400).json({
          error: "参数错误",
          message: "缺少必要分片参数",
        });
      }

      if (!req.file) {
        return res.status(400).json({ error: "文件上传失败" });
      }

      // 加强路径验证
      const chunkPath = path.normalize(req.file.path);
      console.log("分片存储路径:", chunkPath); // 新增路径日志
      if (!fs.existsSync(chunkPath)) {
        throw new Error("分片文件路径无效");
      }

      res.status(200).json({
        code: 200,
        message: "分片上传成功",
        data: {
          index: req.body.index,
        },
      });
    } catch (err) {
      // 如果是客户端取消的请求，不需要返回错误
      if (err.code === "ECONNABORTED" || req.aborted) {
        return;
      }

      console.error("分片上传错误:", err);
      res.status(500).json({
        error: "分片上传失败",
        details: err.message,
      });
    }
  }
);



router.post("/merge", async (req, res) => {
  try {
    const { hash, name, total, size } = req.body;

    // 验证必要参数
    if (!hash || typeof hash !== "string") {
      return res.status(400).json({
        error: "参数错误",
        message: "缺少有效的文件哈希值(hash)",
      });
    }

    const chunkDir = path.resolve(TEMP_DIR, hash);

    // 检查分片目录是否存在
    if (!fs.existsSync(chunkDir)) {
      return res.status(400).json({
        error: "上传未完成",
        message: "未找到上传的分片",
        uploaded: 0,
        total: Number(total),
      });
    }

    // 获取已上传的分片
    const chunks = fs
      .readdirSync(chunkDir)
      .filter((file) => !isNaN(parseInt(path.basename(file).split(".")[0])))
      .sort((a, b) => {
        const aIndex = parseInt(path.basename(a).split(".")[0]);
        const bIndex = parseInt(path.basename(b).split(".")[0]);
        return aIndex - bIndex;
      });

    // 检查是否所有分片都已上传
    if (chunks.length < Number(total)) {
      return res.status(400).json({
        error: "上传未完成",
        message: "文件上传被中断，请继续上传",
        uploaded: chunks.length,
        total: Number(total),
      });
    }

    // 开始合并文件
    const ext = path.extname(name);
    const finalPath = path.resolve(FINAL_DIR, `${hash}${ext}`);

    // 确保目标目录存在
    await fs.ensureDir(FINAL_DIR);
    const writeStream = fs.createWriteStream(finalPath);

    // 合并分片
    for (const chunk of chunks) {
      const chunkPath = path.resolve(chunkDir, chunk);
      try {
        const data = await fs.readFile(chunkPath);
        await new Promise((resolve, reject) => {
          writeStream.write(data, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
        // 立即删除已处理的分片
        await fs.unlink(chunkPath).catch(console.error);
      } catch (err) {
        console.error(`处理分片 ${chunk} 失败:`, err);
        throw new Error(`分片 ${chunk} 处理失败: ${err.message}`);
      }
    }

    // 完成写入并删除临时目录
    writeStream.end();
    await new Promise((resolve) => writeStream.on("finish", resolve));
    await fs.remove(chunkDir).catch(console.error);

    res.json({
      url: `/uploads/final/${hash}${ext}`,
      message: "合并成功",
    });
  } catch (err) {
    console.error("合并错误:", err);
    res.status(500).json({
      error: "合并失败",
      details: err.message,
    });
  }
});



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
 console.log(token.phone);
 
 try{
  let data = await yonghumodel.findOne({ phone:token.phone }).populate('role_id')
  console.log(data.role_id);
  let user= await yonghumodel.findOne({phone:token.phone})
  //根据用户角色查询权限查新路由
  let arr =[]
  for (let i = 0; i < data.role_id.length; i++) {
      console.log();
      for(let j=0;j<data.role_id[i].urls.length;j++){
         let a = await luyoumodel.findOne({_id:data.role_id[i].urls[j]})
         arr.push(a)
      }
  }
  console.log(arr);
  
  res.send({
    code:200,
    msg:'获取用户信息成功',
    data,
    arr,
    user
  })
 }catch(err){
  res.send({
    code:500,
    msg:'获取用户信息失败',
  }) 
 }
})

router.get("/getusers",async(req,res)=>{
  
})

module.exports = router;
 