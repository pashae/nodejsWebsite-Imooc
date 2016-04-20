// 用于和电影进行交互
// 加载电影模型
var Movie = require('../models/movie');
// 引入评论模型
var Comment = require('../models/comment');
// 引入分类模块
var Category = require('../models/category');
// 更新字段
var _ = require('underscore');
// 系统级别的文件读取
var fs = require('fs');
var path = require('path');

// 详情页
exports.detail = function(req,res) {
	var id = req.params.id;

	// 更新访客数量
	Movie.update({_id:id},{$inc:{pv:1}},function (err) {
		if (err) {
		    console.log(err);
		}
	})

	Movie.findById(id,function (err,movie) {
		Comment
			.find({movie: id})
			.populate('from','name')
			.populate('reply.from reply.to','name')
			.populate('from','name')
			.exec(function (err,comments) {
				console.log(comments)
				res.render('detail',{
					title:'hans 详情页',
					id: id,
					movie: movie,
					comments: comments
				}) 
			})	
	})	
}
// 后台录入页
exports.new = function(req,res) {
	Category.find({},function (err,categories) {
		res.render('admin',{
			title:'hans 后台录入页',
			categories: categories,
			movie:{}
		}); 
	})
}
// 更新列表
exports.update = function(req,res) {
	var id = req.params.id;
	if (id) {
		Movie.findById(id,function(err,movie) {
			Category.find({},function (err,categories) {
	            res.render('admin',{
	            	title: 'hans 后台更新页',
	            	movie: movie,
	            	categories: categories
	            })
	        })
		})
	}
}
// 提交海报
exports.savePoster = function (req,res,next) {
	var posterData = req.files.uploadPoster;
	console.log(posterData)
	// 文件的路径
	var filePath = posterData.path;
	console.log(filePath)
	// 文件的原始名字
	var originalFilename = posterData.originalFilename;
	console.log(originalFilename)

	if (originalFilename) {
		fs.readFile(filePath,function (err,data) {
			// 时间戳
			var timestamp = Date.now();
			console.log(timestamp)
			var type = posterData.type.split('/')[1];
			console.log(type)
			// 新的文件名字
			var poster = timestamp + '.' + type;
			// 服务器路径
			var newPath = path.join(__dirname,'../../','/public/upload/' + poster);
			console.log(newPath)
			// 将文件写入
			fs.writeFile(newPath,data,function (err) {
				req.poster = poster;
				next();
			})
		})
	} else {
		next();
	}
}
// 提交电影
exports.save = function (req,res) {
	var id = req.body.movie._id;
	var movieObj = req.body.movie;
	var _movie;

	if (req.poster) {
		movieObj.poster = req.poster;
	}

	if (id) {
	 	// 电影已经存在，需要进行更新
	 	Movie.findById(id,function (err,movie) {
	 		if (err) {
                console.log(err);
	 		}
	 		_movie = _.extend(movie,movieObj);
	 		_movie.save(function (err,movie) {
	 			if (err) {
                	console.log(err);
	 			}
	 			// 重定向到新的地址
	 			res.redirect('/movie/' + movie._id);
	 		})
	 	})
	} else {
	 	_movie = new Movie(movieObj);
	 	var categoryId = movieObj.category;
	 	var categoryName = movieObj.categoryName;
 		_movie.save(function (err,movie) {
 			if (err) {
            	console.log(err);
 			}
 			// 判断是否是新创建的分类
 			if (categoryId) {
 				Category.findById(categoryId,function (err,category) {
 					category.movies.push(movie._id);
 					category.save(function (err,category) {
 						// 重定向到新的地址
 						res.redirect('/movie/' + movie._id); 
 					})
 				});
 			} else if (categoryName) {
 				var category = new Category({
 					name: categoryName,
 					movies: [movie._id]
 				});
 				category.save(function (err,category) {
 					movie.category = category._id;
 					movie.save(function (err,movie) {
 						// 重定向到新的地址
 						res.redirect('/movie/' + movie._id); 
 					});
 				});
 			}
 		})
	 } 
}
// 后台列表页
exports.list = function(req,res) {
	// 拿数据
	Movie.fetch(function (err,movies) {
		if (err) {
			console.log(err);
		} 
		res.render('list',{
			title:'hans 列表页',
			movies: movies
		});
	})
}

// 删除后台列表中的条目
exports.del = function (req,res) {
	var id = req.query.id;

	if (id) {
		Movie.remove({_id:id},function(err,movie) {
			if (err) {
				console.log(err);
			} else {
				res.json({success:1});
			}
		})
	} 
}