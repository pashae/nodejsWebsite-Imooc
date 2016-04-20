// 用于和电影进行交互
// 加载电影模型
var Category = require('../models/category');
// 后台录入页
exports.new = function(req,res) {
	res.render('category_admin',{
		title: 'hans 后台分类录入页',
		category: {}
	});
}
// 拿到后台路由post过来的数据
exports.save = function (req,res) {
	var _category = req.body.category;

 	var category = new Category(_category);
	category.save(function (err,movie) {
		if (err) {
    	console.log(err);
		}
		// 重定向到新的地址
		res.redirect('/admin/category/list');
	}) 
}
// 分类列表页
exports.list = function(req,res) {
	// 拿数据
	// 有一个bug是在/admin/userList页面注册的时候会提示can's post to admin/signUp
	Category.fetch(function (err,categories) {
		if (err) {
			console.log(err);
		} 
		res.render('categorylist',{
			title:'hans 分类列表页',
			categories: categories
		});
	})
}