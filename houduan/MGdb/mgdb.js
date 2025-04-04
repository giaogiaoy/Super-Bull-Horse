const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://giaogiaoyao:wangziyao1314@cluster0.de4wdak.mongodb.net/SuperBullHose').then(()=>{
    console.log('连接成功');
}).catch(()=>{
    console.log('连接失败');
})

let CASchema = new mongoose.Schema({ //社区活动表
    activeName:String, //活动名称
    singupState:Date,  //报名开始时间
    singupEnd:Date, //报名结束时间
    activeState:Date, //活动开始时间
    activeEnd:Date, //活动结束时间
    singupNum:Number,  //报名人数 0:不限制
    singupNumNow:Number, //当前报名人数
    activeImg:String, //活动图片
    activeContent:String, //活动内容
    activeAddress:String, //活动地址
    Appendix:String, //附件
    Reviewer:String, //审核人
    ReviewerState:{
        type:Number,
        default:1
    }, //审核状态  1:审核中 2:已通过 3:已驳回
    Creator:String, //创建人
    AboutCommunity:String, //所属社区
    CreateState:Date, //创建时间
    isEnd:{
        type:Boolean,
        default:false
    }, //是否强制结束  仅在突发情况下使用
})
let CAModel = mongoose.model('CAModel',CASchema)


module.exports = {
    CAModel
}
