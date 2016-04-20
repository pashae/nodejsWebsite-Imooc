// 引入建模的工具模块
var mongoose = require('mongoose');
// mongo数据库模块获取ObjectId
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
// 创建模式对象，针对录入的电影
var CategorySchema = new Schema({
	name: String,
	movies: [{
		type: ObjectId,
		ref: 'Movie',
	}],
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
CategorySchema.pre('save',function (next) {
	// 判断数据是否是新添加的
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}
	// 保证存储过程得以继续
	next();
})

CategorySchema.statics = {
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
module.exports = CategorySchema;