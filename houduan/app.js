var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var jwt = require('jsonwebtoken');
var app = express();

// 允许所有来源的请求
app.use(cors())

// 或者指定允许的来源
app.use(cors({
  origin: 'http://localhost:5173',  // 你的前端地址
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  // allowedHeaders: ['Content-Type', 'Authorization']
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/uploads/final', express.static(path.join(__dirname, 'uploads/final')));
app.use('/upload',express.static(path.join(__dirname, 'upload')));
app.use('/', indexRouter);
app.use('/users', usersRouter);

// 自定义中间件，用于处理 JWT 验证
app.use((req, res, next) => {
  // 定义不需要验证的路径
  let pathArr = [
      '/phone', // 用户登录路径
      '/login' // 刷新 token 的路径
  ]
  
  // 如果请求路径在不需要验证的路径中，直接调用 next() 继续处理
  if (pathArr.includes(req.path)) {
      return next()
  }

  // 获取请求头中的 accessToken 和 refreshToken
  const accessToken = req.headers.accesstoken; // 注意：这里的 'accesstoken' 虽然前端传过来是驼峰命名法'accessToken'
  const refreshToken = req.headers.refreshtoken; //但是这里也要全部小写，http的机制导致

  // 判断 refreshToken 是否过期
  try {
      jwt.verify(refreshToken, '123456'); // 验证 refreshToken
  } catch (error) {
      console.log(error); // 打印错误信息
      return res.status(403).send({ message: 'Forbidden' }); // 如果验证失败，返回 403 Forbidden
  }

  // 如果没有 accessToken，返回 401 Unauthorized
  if (!accessToken) {
      return res.status(401).send({ message: 'Unauthorized' });
  }

  // 验证 accessToken
  try {
      const user = jwt.verify(accessToken, '123456'); // 验证 accessToken
      res.locals.user = user; // 将用户信息存储在 res.locals 中，供后续中间件使用
      return next(); // 验证成功，调用 next() 继续处理请求
  } catch (error) {
      return res.status(401).send({ message: 'Unauthorized' }); // 如果验证失败，返回 401 Unauthorized
  }
})



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
