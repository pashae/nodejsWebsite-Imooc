var mongoose = require('mongoose');
var CommentSchema = require('../schemas/comment.js');
// 发布模型
var Comment = mongoose.model('Comment',CommentSchema)
// 输出网页模型
module.exports = Comment;