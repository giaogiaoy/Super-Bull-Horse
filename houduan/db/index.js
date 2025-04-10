var  mongoose = require('mongoose')
mongoose.connect('mongodb+srv://giaogiaoyao:wangziyao1314@cluster0.de4wdak.mongodb.net/SuperBullHose').then(
    ()=>{
        console.log('连接成功')
    }
).catch((err)=>{
    console.log('连接失败')
})
// 
const peopleSchema = new mongoose.Schema({
    name:String, //姓名
    age:Number, //年龄
    sex:String, //性别
    address:String, //居住地址
    phone:String, //手机号
    img:String, //照片
    time:String, //时间
    type:String,//关怀类型,
    ID:String,//身份证号
    desc:String,//关怀内容描述
})
const peopleModel = mongoose.model('people',peopleSchema,'people')

//施工物
const ReportSchema = new mongoose.Schema({
    name:String, //姓名
    building:String, //建筑
    address:String, //居住地址
    phone:String, //手机号
    beganTime:String, //开始时间
    date:String, //施工工期
    status:Boolean,//状态
    roal:String,//角色
    JtAddress:String,//具体地址
})
const ReportModel = mongoose.model('Report',ReportSchema,'Report')

//
const Travelrecord = new mongoose.Schema({
   time:String,//通行时间
   name:String,//姓名
   ID:String,//身份证
   phone:String,//手机号
   type:String,//类型
   address:String,//地址
   img:String,//照片
   status:Boolean,//状态
   roal:String,//角色
   JtAddress:String,//具体地址
})
const TravelrecordModel = mongoose.model('Travelrecord',Travelrecord,'Travelrecord')
module.exports={
   peopleModel,ReportModel,TravelrecordModel
}