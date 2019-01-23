var sessionFactory = require('../utils/session.js');

var whiteList = ['/user/login', '/upload/file']

module.exports = (req, res, next) => {
	if (whiteList.indexOf(req.originalUrl) > -1)
		return next()
	var token = req.headers['x-token']
	if (sessionFactory.checkSession(token))
		next()
	else
		res.json({
			code: -1,
			message: '长时间未操作，登录失效'
		})
};