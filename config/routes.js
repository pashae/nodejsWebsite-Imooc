// 获取方法
var Index = require('../app/controllers/index');
var Movie = require('../app/controllers/movie');
var User = require('../app/controllers/user');
var Comment = require('../app/controllers/comment');
var Category = require('../app/controllers/category');

// 抛出模块
module.exports = function (app) {
	// 对用户的预处理
	app.use(function (req,res,next) {
		var _user = req.session.user;
		
		app.locals.user = _user;

		next();
	})
	// 首页
	app.get('/', Index.index);
	// 用户注册、登录、登出、列表、展示登录页面、展示注册页面
	app.post('/user/signup',User.signup);
	app.post('/user/login',User.login);
	app.get('/logout',User.logout);
	// 用户在登录且权限为管理员的前提下才能访问该页面
	app.get('/admin/user/list',User.loginRequired,User.adminRequired,User.list);
	app.get('/login',User.showLogin);
	app.get('/signup',User.showSignup);
	// 电影详情页、后台录入页、更新列表、电影保存、列表、删除
	app.get('/movie/:id',Movie.detail);
	app.get('/admin/movie/new',User.loginRequired,User.adminRequired,Movie.new);
	app.get('/admin/movie/update/:id',User.loginRequired,User.adminRequired,Movie.update);
	app.post('/admin/movie',User.loginRequired,User.adminRequired,Movie.savePoster,Movie.save);
	app.get('/admin/movie/list',User.loginRequired,User.adminRequired,Movie.list);
	app.delete('/admin/movie/list',User.loginRequired,User.adminRequired,Movie.del);
	// 评论部分
	app.post('/user/comment',User.loginRequired,Comment.save);
	// 后台分类录入页
	app.get('/admin/category/new',User.loginRequired,User.adminRequired,Category.new);
	app.post('/admin/category',User.loginRequired,User.adminRequired,Category.save);
	app.get('/admin/category/list',User.loginRequired,User.adminRequired,Category.list);
	// 
	app.get('/results',Index.search);
}