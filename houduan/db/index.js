var  mongoose = require('mongoose')
mongoose.connect('mongodb://').then(
    ()=>{
        console.log('连接成功')
    }
).catch((err)=>{
    console.log('连接失败')
})


module.exports={
   
}