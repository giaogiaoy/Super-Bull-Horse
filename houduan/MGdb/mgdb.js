const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://giaogiaoyao:wangziyao1314@cluster0.de4wdak.mongodb.net/SuperBullHose').then(()=>{
    console.log('连接成功');
}).catch(()=>{
    console.log('连接失败');
})


//角色管理
let juese = new mongoose.Schema({
    name:String,
    urls:Array,
})
let juesemodel = mongoose.model('juese',juese)
//路由管理
let luyou = new mongoose.Schema({
    name:String,
    url:String,
    level:Number,
    pid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'luyou',
    }
})
let luyoumodel = mongoose.model('luyou',luyou)
//用户管理
let yonghu = new mongoose.Schema({
    name:String,
    password:String,
    phone:String,
    role_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'juese',
    },
    date:{
        type:Date,
        default:new Date()
    }
})
let yonghumodel = mongoose.model('yonghu',yonghu)


module.exports = {
    juesemodel,
    luyoumodel,
    yonghumodel,
}
