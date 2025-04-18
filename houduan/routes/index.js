var express = require("express");
var router = express.Router();
var { CAModel } = require("../MGdb/mgdb");
const path = require("path");
const fs = require("fs-extra");
const multer = require("multer");
const crypto = require("crypto");
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
  "/upload",
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

// 文件合并接口
// router.post("/merge1", async (req, res) => {
//   try {
//     // 如果是暂停状态，返回特殊状态码
//     if (req.aborted) {
//       return res.status(499).json({
//         code: 499,
//         message: "上传已暂停",
//       });
//     }

//     // console.log("合并请求参数:", req.body);
//     if (!req.body.size || isNaN(Number(req.body.size))) {
//       return res.status(400).json({
//         error: "参数错误",
//         message: "缺少有效的文件大小(size)",
//       });
//     }
//     const { hash, name, total } = req.body;

//     // console.log("合并请求参数:", { hash, name, total });

//     // 验证必要参数
//     if (!hash || typeof hash !== "string") {
//       return res.status(400).json({
//         error: "参数错误",
//         message: "缺少有效的文件哈希值(hash)",
//       });
//     }
//     if (!name || typeof name !== "string") {
//       return res.status(400).json({
//         error: "参数错误",
//         message: "缺少有效的文件名(name)",
//       });
//     }
//     if (!total || isNaN(Number(total))) {
//       return res.status(400).json({
//         error: "参数错误",
//         message: "缺少有效的总分片数(total)",
//       });
//     }

//     const ext = path.extname(name);
//     const finalPath = path.resolve(FINAL_DIR, `${hash}${ext}`);
//     const chunkDir = path.resolve(TEMP_DIR, hash);
//     // console.log("分片目录路径:", chunkDir);

//     // 如果是暂停状态，不删除分片目录
//     if (!req.aborted && fs.existsSync(chunkDir)) {
//       const chunks = fs.readdirSync(chunkDir);
//       if (chunks.length < Number(total)) {
//         return res.status(400).json({
//           error: "上传未完成",
//           message: "文件上传被中断，请继续上传",
//           uploaded: chunks.length,
//           total: Number(total),
//         });
//       }
//     }

//     // 检查目录权限
//     try {
//       await fs.access(TEMP_DIR, fs.constants.R_OK | fs.constants.W_OK);
//       await fs.access(FINAL_DIR, fs.constants.R_OK | fs.constants.W_OK);
//     } catch (err) {
//       console.error("目录权限错误:", err);
//       return res.status(500).json({
//         error: "权限错误",
//         message: "无法访问上传目录，请检查目录权限",
//       });
//     }

//     // 获取分片文件列表前确保目录存在
//     if (!fs.existsSync(chunkDir)) {
//       console.error("分片目录不存在:", chunkDir);
//       return res.status(400).json({
//         error: "分片不存在",
//         message: `找不到分片目录: ${hash}`,
//       });
//     }

//     // // 移动调试日志到正确位置
//     const chunks = fs
//       .readdirSync(chunkDir)
//       .filter((file) => {
//         const base = path.basename(file);
//         return !isNaN(parseInt(base.split(".")[0]));
//       })
//       .sort((a, b) => {
//         const aIndex = parseInt(path.basename(a).split(".")[0]);
//         const bIndex = parseInt(path.basename(b).split(".")[0]);
//         return aIndex - bIndex;
//       });

//     // 移动调试日志到正确位置
//     // console.log("分片目录路径:", chunkDir);
//     // console.log("实际分片文件:", chunks);
//     // console.log("预期分片数量:", total);

//     // 验证分片数量
//     if (chunks.length !== Number(total)) {
//       return res.status(400).json({
//         error: "分片数量不符",
//         expected: total,
//         actual: chunks.length,
//       });
//     }

//     // 添加分片目录检查
//     if (!fs.existsSync(chunkDir)) {
//       const tempDirContents = fs.readdirSync(TEMP_DIR);
//       console.error("临时目录内容:", tempDirContents);
//       return res.status(400).json({
//         error: "分片不存在",
//         message: `找不到分片目录: ${chunkDir}`,
//       });
//     }

//     // 创建可写流前确保目标目录存在
//     await fs.ensureDir(FINAL_DIR);
//     // const writeStream = fs.createWriteStream(finalPath);

//     try {
//       // 获取并排序分片文件（增强排序逻辑）
//       const chunks = fs.readdirSync(chunkDir);
//       const sortedChunks = chunks
//         .filter((file) => !isNaN(parseInt(path.basename(file).split(".")[0]))) // 过滤有效分片
//         .sort((a, b) => {
//           const aIndex = parseInt(path.basename(a).split(".")[0]);
//           const bIndex = parseInt(path.basename(b).split(".")[0]);
//           return aIndex - bIndex;
//         });

//       // 验证分片数量
//       if (sortedChunks.length !== Number(total)) {
//         return res.status(400).json({
//           error: "分片数量不符",
//           expected: total,
//           actual: sortedChunks.length,
//         });
//       }
//       // 创建可写流之前确保目标目录存在
//       await fs.ensureDir(FINAL_DIR);
//       const writeStream = fs.createWriteStream(finalPath);

//       // 合并分片
//       for (const chunk of sortedChunks) {
//         const chunkPath = path.resolve(chunkDir, chunk);

//         try {
//           const data = await fs.readFile(chunkPath);
//           await new Promise((resolve, reject) => {
//             writeStream.write(data, (err) => {
//               if (err) reject(err);
//               else resolve();
//             });
//           });
//           // 立即删除已处理的分片
//           await fs.unlink(chunkPath).catch(console.error);
//         } catch (err) {
//           console.error(`处理分片 ${chunk} 失败:`, err);
//           throw new Error(`分片 ${chunk} 处理失败: ${err.message}`);
//         }
//       }

//       writeStream.end();
//       await new Promise((resolve) => writeStream.on("finish", resolve));

//       // 改为使用 remove 方法删除目录（兼容非空目录）
//       await fs.remove(chunkDir).catch(console.error);

//       res.json({
//         url: `/uploads/final/${hash}${ext}`,
//         message: "合并成功",
//       });
//     } catch (err) {
//       throw new Error(`文件合并失败: ${err.message}`);
//     }
//   } catch (err) {
//     console.error("合并错误:", err);
//     res.status(500).json({
//       error: "合并失败",
//       details: err.message,
//     });
//   }
// });

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
module.exports = router;
