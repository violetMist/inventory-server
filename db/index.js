var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserModel = require('./modules/user.js')

//🔗数据库
mongoose.connect('mongodb://47.75.81.230:27017/db', {
	useNewUrlParser: true
}, function(err) {
	if (err)
		console.dir('数据库🔗失败');
	else {
		console.dir('数据库🔗成功');
		UserModel.findOne({
			account: 'admin',
			password: 'Y13801454838e',
		}).then(r => {
			if (!r) {
				var admin = new UserModel({
					name: 'admin',
					account: 'admin',
					password: 'Y13801454838e',
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