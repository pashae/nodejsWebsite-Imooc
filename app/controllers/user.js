// 用于和用户进行交互
// 加载用户模型
var User = require('../models/user');
// 用户注册
exports.signup = function (req,res) {
	var _user = req.body.user;
	// req.param('user')
	// 首先判断新注册的用户名是否存在
	User.findOne({name: _user.name},function (err,user) {
		if (err) {
			console.log(err);
		}
		if (user) {
			return res.redirect('/login');
		} else {
			var user = new User(_user);
			// 存储
			user.save(function (err,user) {
				if (err) {
					console.log(err);
				}
				res.redirect('/');
			})
		}
	})
}
// 用户注册展示
exports.showSignup = function (req,res) {
	// var _user = req.body.user;
	// // req.param('user')
	// // 首先判断新注册的用户名是否存在
	// User.findOne({name: _user.name},function (err,user) {
	// 	if (err) {
	// 		console.log(err);
	// 	}
	// 	if (user) {
	// 		return res.redirect('/');
	// 	} else {
	// 		var user = new User(_user);
	// 		// 存储
	// 		user.save(function (err,user) {
	// 			if (err) {
	// 				console.log(err);
	// 			}
	// 			res.redirect('/admin/userList');
	// 		})
	// 	}
	// })
	res.render('signup',{
		title: '注册页面'
	})
}
// 用户登录
exports.login = function (req,res) {
	var _user = req.body.user;
	var name = _user.name;
	var password = _user.password;
	// 在数据库中查询
	User.findOne({name: name},function (err,user) {
		if (err) {
			console.log(err);
		}
		// 判断用户是否存在
		if (!user) {
			return res.redirect('/signup');
		}
		// 判断密码是否正确
		user.comparePassword(password,function(err,isMatch) {
			if (err) {
				console.log(err);
			}
			if (isMatch) {
				// 把user保存到session中，session:会话
				req.session.user = user;
				return res.redirect('/');
			} else {
				return res.redirect('/login');
			}
		})
	})
}
// 用户登录展示
exports.showLogin = function (req,res) {
	// var _user = req.body.user;
	// var name = _user.name;
	// var password = _user.password;
	// // 在数据库中查询
	// User.findOne({name: name},function (err,user) {
	// 	if (err) {
	// 		console.log(err);
	// 	}
	// 	// 判断用户是否存在
	// 	if (!user) {
	// 		return res.redirect('/');
	// 	}
	// 	// 判断密码是否正确
	// 	user.comparePassword(password,function(err,isMatch) {
	// 		if (err) {
	// 			console.log(err);
	// 		}
	// 		if (isMatch) {
	// 			// 把user保存到session中，session:会话
	// 			req.session.user = user;
	// 			return res.redirect('/');
	// 		} else {
	// 			console.log("Password is not matched");
	// 		}
	// 	})
	// })
	res.render('login',{
		title: '登录页面'
	})
}
// 用户登出
exports.logout = function (req,res) {
	// 删除session里面的user
	delete req.session.user;
	// 删除渲染页面的当前user变量
	//delete app.locals.user;
	// 重定向到首页
	res.redirect('/');
}
// 用户列表页
exports.list = function(req,res) {
	// 拿数据
	// 有一个bug是在/admin/userList页面注册的时候会提示can's post to admin/signUp
	User.fetch(function (err,users) {
		if (err) {
			console.log(err);
		} 
		res.render('userList',{
			title:'hans 用户列表页',
			users: users
		});
	})
}

// 中间件控制用户权限
// 登录中间件
exports.loginRequired = function (req,res,next) {
	var user = req.session.user;

	//尚未登录
	if (!user) {
		return res.redirect('/login');
	} 
	next();
}
// 管理员中间件
exports.adminRequired = function (req,res,next) {
	var user = req.session.user;
	// 
	if (user.role <= 10) {
		return res.redirect('/login')
	}
	next();
}