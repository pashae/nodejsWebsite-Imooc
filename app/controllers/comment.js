// 用于和电影进行交互
// 加载评论模型
var Comment = require('../models/comment');
// 更新字段
var _ = require('underscore');

// 拿到后台路由post过来的数据
exports.save = function (req,res) {
	var _comment = req.body.comment;
	var movieId = _comment.movie;

	// 如果cid存在，则说明用户正在进行回复操作
	if (_comment.cid) {
		Comment.findById(_comment.cid,function (err,comment) {		
			var reply = {
				from: _comment.from,
				to: _comment.tid,
				content: _comment.content
			}
			// 新增一条回复
			comment.reply.push(reply);
			// 保存
			comment.save(function(err,commment) {
				if (err) {
					console.log(err);
				}
				res.redirect('/movie/' + movieId);
			})
		})
	} else {
		// cid不存在，则说明用户正在进行评论
	 	var comment = new Comment(_comment);
		comment.save(function (err,comment) {
			if (err) {
	    	console.log(err);
			}
			// 重定向到新的地址
			res.redirect('/movie/' + movieId);
		})
	}
}