var express = require('express');
var router = express.Router()
var sessionFactory = require('../utils/session.js')
var constant = require('../utils/constant.js')
var User = require('../models/User.js')
var UserModel = require('../db/modules/user.js')

const getRoles = roles => {
	let arr = []
	constant.systemRoles.forEach(s => {
		if (roles.indexOf(s.id) > -1)
			arr.push(s)
		if (s.roles.length)
			s.roles.forEach(r => {
				if (roles.indexOf(r.id) > -1)
					arr.push(r)
			})
	})
	return arr
}

router.post('/login', (req, res, next) => {
	var session = req.session
	UserModel.findOne({
		account: req.body.account,
	}).then(r => {
		if (!r)
			return res.ef('用户不存在')
		if (r.password == req.body.password) {
			sessionFactory.init(session.id, new User(r))
			res.sf({
				token: session.id
			}, '用户已登录')
		} else {
			res.ef('用户密码错误')
		}
	}).catch(err => {
		console.log(err);
	})
});

router.get('/session', (req, res, next) => {
	var token = req.headers['x-token']
	var user = sessionFactory.getInstance()[token]
	res.sf({
		...constant,
		user,
		token: token
	})
});

router.get('/logout', (req, res, next) => {
	var token = req.headers['x-token']
	sessionFactory.clearSession(token)
	res.sf({}, '用户已退出')
});

/* GET users listing. */
router.get('/getList', (req, res, next) => {
	var query = req.query
	UserModel.find({
		$nor: [{
			account: /^admin$/
		}],
		$or: [{
			name: new RegExp(query.name),
			account: new RegExp(query.account)
		}]
	}).sort({
		'_id': -1
	}).then(r => {
		res.sf({
			total: r.length,
			items: r.slice((query.pageNo - 1) * query.pageSize, query.pageNo * query.pageSize).map(c => {
				return new User(c)
			})
		})
	})
})

router.get('/view', (req, res, next) => {
	var query = req.query
	if (query.id) {
		UserModel.findById(query.id).then(r => {
			res.sf(Object.assign({}, new User(r), {
				userRoles: getRoles(r.roles)
			}))
		}).catch(err => {
			res.ef('用户不存在')
		})
	} else {
		res.sf(new User())
	}
})

router.post('/add', (req, res, next) => {
	UserModel.findOne({
		account: req.body.account
	}).then(r => {
		if (r)
			return res.ef('用户名已存在，请重新输入')
		var user = new UserModel(req.body)
		user.save((err, doc) => {
			if (err)
				return res.ef('用户添加失败')
			res.sf({}, '用户添加成功')
		})
	})
})

router.post('/edit', (req, res, next) => {
	UserModel.updateOne({
		_id: req.body.id
	}, {
		$set: {
			name: req.body.name,
			phone: req.body.phone,
			account: req.body.account,
			password: req.body.password,
			roles: req.body.roles
		}
	}).then(r => {
		res.sf({}, '用户编辑成功')
	}).catch(err => {
		res.ef('用户不存在')
	})
})

module.exports = router;