const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://giaogiaoyao:wangziyao1314@cluster0.de4wdak.mongodb.net/SuperBullHose').then(()=>{
    console.log('连接成功');
}).catch(()=>{
    console.log('连接失败');
})



module.exports = {
    
}
