var mongoose = require('mongoose');
var UserSchema = require('../schemas/User.js');
// 
var User = mongoose.model('User',UserSchema)
// 输出用户模型
module.exports = User;