// 
var crypto = require('crypto');
var bcrypt = require('bcryptjs');

function getRandomString (len) {
	if (!len) len = 16;

	return crypto.randomBytes(Math.ceil(len/2)).toString('hex'); 
}

var should = require('should');
var app = require('../../app');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var user;
// test
describe('<Unit Test',function () {
	describe('Model User:',function () {
		before(function (done) {
			user = {
				name: getRandomString(),
				password: 'password' 
			}

			done(); 
		})
		// 保证每一个测试用户都是不存在的
		describe('Before Method save:',function () {
			// id代表一个测试用例,在it中只能调用一次done
			it('should begin without test user',function () {
				User.find({name:user.name},function (err,users) {
					users.should.have.length(0);

					done(); 
				}) 
			})
		})
		//
		describe('User save:',function () {
			// 保存的时候没有错误
			it('should save without problems',function () {
				var _user = new User(user);
				_user.save(function (err) {
					// 保证无措
					should.not.exist(err); 
					_user.remove(function (err) {
						should.not.exist(err); 
					})
				});
			})
			// 保证密码的生成没有问题
			it('should password be hashed correctly',function () {
				var password = user.password;
				var _user = new User(user);
				_user.save(function (err) {
					// 保证无错
					should.not.exist(err);
					_user.password.should.not.have.length(0);

					bcrypt.compare(password,_user.password,function (err,isMatch) {
						should.not.exist(err);
						isMatch.should.equal(true);
						_user.remove(function (err) {
							should.not.exist(err); 
							done();
						})

					}) 
					
				});
			})
			// 保证生成的用户默认的权限是0
			it('should have default role 0',function () {
				var _user = new User(user);
				_user.save(function (err) {
					// 保证无错
					should.not.exist(err);
					_user.role.should.equal(0);

					_user.remove(function (err) {
						should.not.exist(err); 
						done();
					})
				});
			})
			// 保证生成的用户名是唯一的
			it('should fail to save an existing user',function () {
				var _user1 = new User(user);
				_user1.save(function (err) {
					// 保证无错
					should.not.exist(err);
					var _user2 = new User(user);
					_user2.save(function (err) {
						// 保证无错
						should.exist(err);
						_user1.remove(function (err) {
							if (!err) {
								_user2.remove(function (err) {
									done(); 
								})
							}
						})
					});
				});	
			})
		})
		after(function (done) {
			// clear user info
			done(); 
		})
	}) 
})