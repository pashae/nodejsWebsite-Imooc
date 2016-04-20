// 入口文件编码
// 指定样式的路径
var path = require('path');
var express = require('express');
var mongoose = require('mongoose');
// 引入session插件
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
// 引入session与数据库连接插件
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
// 引入报错插件
var logger = require('morgan');
// 引入海报上传中间件
var multipart = require('connect-multiparty');
// var multer = require('multer');
// var multiparty = require('multiparty');
// 
var fs = require('fs');
// 启动一个web服务器
var app = express();
var port = process.env.PORT || 12345;
// 数据库地址
var dbUrl = "mongodb://localhost/hans";
// 连接数据库
mongoose.connect(dbUrl);
// 添加本地变量
app.locals.moment = require('moment');

// 添加本地model
var models_path = __dirname + '/app/models';
var walk = function (path) {
	fs
	    .readdirSync(path)
	    .forEach(function (file) {
	    	var newPath =  path + '/' + file;
	    	var stat = fs.statSync(newPath);

	    	if (stat.isFile()) {
	    		if (/(.*)\.(js|coffee)/.test(file)) {
	    			require(newPath);
	    		}
	    	} else if (stat.isDirectory()) {
	    		walk(newPath);
	    	}
	    }) 
}
walk(models_path);


// 设置视图的根目录
app.set('views','./app/views/pages');
// 设置视图的引擎
app.set('view engine','jade');
// 将表单数据进行格式化
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
// 这里是两个下划线的路径名字
app.use(express.static(path.join(__dirname,'public')));
// multipart/form-data中间件的加载
app.use(multipart());
// app.use(multer({dest:"./public/upload"}));
// app.use(multiparty);
// session     ,这个插件依赖于cookieParser这个中间件
app.use(cookieParser());
app.use(cookieSession({
	serect: 'hans',
	name: 'session',
	keys: ['key1','key2'],
	// resave: false,
	// saveUninitialized: true
	store: new mongoStore({
		url: dbUrl,
		collection: 'sessions'
	})
}))

// 配置开发环境
var env = process.env.NODE_ENV || 'development';

// 对报错进行控制
if ('development' === env) {
	app.set('showStackError',true);
	// 请求建立的方法、路径、状态值
	app.use(logger(':method :url :status'));
	// 让代码变为格式化的
	app.locals.pretty = true;
	// 添加数据库监听
	mongoose.set('debug',true);
}


// 引用路由
require('./config/routes.js')(app);

// 监听端口
app.listen(port);

// 打印日志
console.log('hans started on port ' + port);


// 前端测试流程
// localhost:12345/
// localhost:12345/movie/1         电影详情页
// localhost:12345/admin/movie 	后台录入页
// localhost:12345/admin/list 		后台列表页