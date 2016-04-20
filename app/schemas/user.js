// 引入建模的工具模块
var mongoose = require('mongoose');
// 引入加密算法模块
var bcrypt = require('bcryptjs');
// 加密算法强度
var SALT_WORK_FACTOR = 10;
// 创建模式对象，针对用户
var UserSchema = new mongoose.Schema({
	name: {
		unique: true, //唯一性
		type: String
	},
	// 密码保护。采用加盐后密码的哈希值
	password: String,
	// 用户角色分配 0:normal user,1:verified user,2:professional user
	// 				>10: admin >50: super admin
	role: {
		type: Number,
		default: 0
	},
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
})
// 每次保存数据之前都会调用这个方法
UserSchema.pre('save',function (next) {
	// 设定当前用户
	var user = this;
	// 判断数据是否是新添加的
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}
	// 
	bcrypt.genSalt(SALT_WORK_FACTOR,function (err,salt) {
		if (err) {
			return next(err);
		}
		bcrypt.hash(user.password,salt,function (err,hash) {
			if (err) {
				return next(err);
			}
			user.password = hash;
			next();
		}) 
	})
})
// 这都是实例方法
UserSchema.methods = {
	comparePassword: function (_password,fn) {
		bcrypt.compare(_password,this.password,function (err,isMatch) {
			if (err) return fn(err);
			fn(null,isMatch);
		}) 
	}
}

// 这都是静态方法
UserSchema.statics = {
	// 返回数据库中所有的数据
	fetch: function (fn) {
		return this
			.find({})
			// 按照更新时间排序
			.sort("meta.updateAt")
			.exec(fn);
	},
	// 单条数据的查询
	findById: function (id,fn) {
		return this
			.findOne({_id:id})
			.exec(fn);
	}
}
// 将模式输出
module.exports = UserSchema;