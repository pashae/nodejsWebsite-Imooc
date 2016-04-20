var mongoose = require('mongoose');
var CategorySchema = require('../schemas/category.js');
// 发布模型
var Category = mongoose.model('Category',CategorySchema)
// 输出网页模型
module.exports = Category;