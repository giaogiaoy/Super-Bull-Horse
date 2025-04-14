const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://giaogiaoyao:wangziyao1314@cluster0.de4wdak.mongodb.net/SuperBullHose"
  )
  .then(() => {
    console.log("连接成功");
  })
  .catch(() => {
    console.log("连接失败");
  });

//路由管理
let luyou = new mongoose.Schema({
  name: String,
  url: String,
  level: Number,
  pid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "luyou",
    required: false,
  },
});

//角色管理
let juese = new mongoose.Schema({
  name: String,
  urls: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "luyou",
    },
  ],
});
let juesemodel = mongoose.model("juese", juese);

let luyoumodel = mongoose.model("luyou", luyou);
//用户管理
let yonghu = new mongoose.Schema({
  name: String,
  password: String,
  phone: String,
  role_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "juese",
    },
  ],
  date: {
    type: Date,
    default: new Date(),
  },
});
let yonghumodel = mongoose.model("yonghu", yonghu);

//社区活动表
let CASchema = new mongoose.Schema({
  activeName: String, //活动名称
  singupState: Date, //报名开始时间
  singupEnd: Date, //报名结束时间
  activeState: Date, //活动开始时间
  activeEnd: Date, //活动结束时间
  singupNum: Number, //报名人数 0:不限制
  singupNumNow: {
    type: Number,
    default: 0,
  }, //当前报名人数
  activeImg: String, //活动图片
  activeContent: String, //活动内容
  activeAddress: String, //活动地址
  Appendix: String, //附件
  Reviewer: {
    type: String,
    default: "高主管",
  }, //审核人
  ReviewerState: {
    type: Number,
    default: 1,
  }, //审核状态  1:审核中 2:已通过 3:已驳回
  Creator: {
    type: String,
    default: "小李子",
  }, //创建人
  AboutCommunity: String, //所属社区
  CreateState: Date, //创建时间
  isEnd: {
    type: Boolean,
    default: false,
  }, //是否强制结束  仅在突发情况下使用
});
// 添加复合索引
CASchema.index({ activeName: 1 });
CASchema.index({ singupState: 1, singupEnd: 1 });
CASchema.index({ activeState: 1, activeEnd: 1 });
CASchema.index({ ReviewerState: 1 });
CASchema.index({ isEnd: 1 });

let CAModel = mongoose.model("CAModel", CASchema);

const peopleSchema = new mongoose.Schema({
  name: String, //姓名
  age: Number, //年龄
  sex: String, //性别
  address: String, //居住地址
  phone: String, //手机号
  img: String, //照片
  time: String, //时间
  type: String, //关怀类型,
  ID: String, //身份证号
  desc: String, //关怀内容描述
});
const peopleModel = mongoose.model("people", peopleSchema, "people");

//施工物
const ReportSchema = new mongoose.Schema({
  name: String, //姓名
  building: String, //建筑
  address: String, //居住地址
  phone: String, //手机号
  beganTime: String, //开始时间
  date: String, //施工工期
  status: Boolean, //状态
  roal: String, //角色
  JtAddress: String, //具体地址
});
const ReportModel = mongoose.model("Report", ReportSchema, "Report");

//通行记录人员
const Travelrecord = new mongoose.Schema({
  time: String, //通行时间
  name: String, //姓名
  ID: String, //身份证
  phone: String, //手机号
  type: String, //类型
  address: String, //地址
  img: String, //照片
  status: Boolean, //状态
  roal: String, //角色
  JtAddress: Object, //具体地址
  passStart: String, //通行开始时间
  passEnd: String, //通行结束时间
  isUse: {
    type: Boolean,
    default: true,
  }, //是否使用
  totalCount: Number, // 总通行次数,
  remainingCount: Number, // 剩余通行次数,
  enterNum: Number, // 进入次数,
  outerNum: Number, // 出去次数,
  limitNum: Number, // 限制次数,
  QRCodeDesc: String, //二维码描述
  QRCode: String, //二维码
});

const TravelrecordModel = mongoose.model(
  "Travelrecord",
  Travelrecord,
  "Travelrecord"
);
//缴费表
const PaySchema = new mongoose.Schema({
  MainAddress: String, //主地址
  SubAddress: String, //子地址
  name: String, //姓名
  person:String,//缴费人
  phone: String, //手机号
  ID: String, //身份证号
  time: Date, //缴费时间
  Money:String//该缴费金额
})

const PayModel = mongoose.model("Pay", PaySchema, "Pay");
const FinishPaySchema  = new mongoose.Schema({
  
})
const FinishModel = mongoose.model('finish',FinishPaySchema,'finish')
module.exports = {
  CAModel,
  juesemodel,
  luyoumodel,
  yonghumodel,
  peopleModel,
  ReportModel,
  TravelrecordModel,
  PayModel,
  FinishModel,
};
