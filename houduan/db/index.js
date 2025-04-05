var  mongoose = require('mongoose')
mongoose.connect('mongodb+srv://giaogiaoyao:wangziyao1314@cluster0.de4wdak.mongodb.net/people').then(
    ()=>{
        console.log('连接成功')
    }
).catch((err)=>{
    console.log('连接失败')
})

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


})
const peopleModel = mongoose.model('people',peopleSchema,'people')
module.exports={
   peopleModel
}