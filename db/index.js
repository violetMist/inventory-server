var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserModel = require('./modules/user.js')

//🔗数据库
mongoose.connect('mongodb://localhost:27017/db', {
	useNewUrlParser: true
}, function(err) {
	if (err)
		console.dir('数据库🔗失败');
	else {
		console.dir('数据库🔗成功');
		UserModel.findOne({
			account: 'admin',
			password: 123456,
		}).then(r => {
			if (!r) {
				var admin = new UserModel({
					name: 'admin',
					account: 'admin',
					password: 123456,
					phone: 13801454838,
					roles: [-1]
				})
				admin.save((err, doc) => {
					if (err)
						return console.log(err);
					console.dir('保存一条📝' + doc);
				})
			}
		}).catch(err => {
			console.log(err)
		})
	}
});

module.exports = mongoose;