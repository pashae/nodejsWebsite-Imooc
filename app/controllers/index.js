// 用于和首页进行交互
// 加载电影模型
var Movie = require('../models/movie');
var Category = require('../models/category');
// 首页
exports.index = function(req,res) {
	// 动态的获取user的信息，但是这些语句放在这里是不合理的
	// 一旦在别的页面登录时，这样做就失败了
	// var _user = req.session.user;
	// if (_user) {
	// 	// 将获取的user的信息保存到本地的变量里
	// 	app.locals.user = _user;
	// }
	Category
		.find({})
		// 路径以及限制每条数据下只读取6条
		.populate({
			path:'movies',
			select: 'title poster',
			options:{
				limit:6
			}
		})
		.exec(function (err,categories) {
			if (err) {
				console.log(err);
			} 

			res.render('index',{
				title:'hans 首页',
				categories: categories
			}); 
		})
}
// 查询
exports.search = function(req,res) {
	var catId = req.query.cat;
	var page = parseInt(req.query.p,10) || 0;
	var count = 2;
	var index = page * count;
	// 获取关键字
	var q = req.query.qsearch;
	// 结果展示页的两种方式，第一种是结果页
	// 点击分类题目展示
	if (catId) {
		Category
			.find({_id:catId})
			.populate({
				path:'movies',
				select: 'title poster'
			})
			.exec(function (err,categories) {
				if (err) {
					console.log(err);
				} 
				var category = categories[0] || {};
				var movies = category.movies || [];
				var results = movies.slice(index,index + count);
				console.log(category)
				res.render('results',{
					title:'hans 结果列表页',
					keyword: category.name,
					query: 'cat=' + catId,
					currentPage: (page + 1),
					totalPage: Math.ceil(movies.length / count),
					movies: results
				}); 
			})
		} else {
			// 来自于搜索框的搜索
			Movie
				.find({title: new RegExp(q + '.*','i')})
				.exec(function (err,movies) {
					if (err) {
						console.log(err);
					} 
					var results = movies.slice(index,index + count);
					res.render('results',{
						title:'hans 结果列表页',
						keyword: q,
						query: 'q=' + q,
						currentPage: (page + 1),
						totalPage: Math.ceil(movies.length / count),
						movies: results
					}); 
				})
		}
	
}