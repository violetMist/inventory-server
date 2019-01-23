var express = require('express')
var router = express.Router()
var Commercial = require('../models/Commercial.js')
var CommercialModel = require('../db/modules/commercial.js')

router.get('/getList', (req, res, next) => {
	var query = req.query
	CommercialModel.find({
		name: new RegExp(query.name),
		type: new RegExp(query.type)
	}).then(r => {
		res.sf({
			total: r.length,
			items: r.slice((query.pageNo - 1) * query.pageSize, query.pageNo * query.pageSize).map(c => {
				return new Commercial(c)
			})
		})
	}).catch(err => {
		console.log(err);
	})
})

router.get('/view', (req, res, next) => {
	var query = req.query
	if (query.id) {
		CommercialModel.findById(query.id).then(r => {
			res.sf(new Commercial(r))
		}).catch(err => {
			res.ef('商户不存在')
		})
	} else {
		res.sf(new Commercial())
	}
})

router.post('/add', (req, res, next) => {
	CommercialModel.findOne({
		name: req.body.name
	}).then(r => {
		if (r)
			return res.ef('商户名已存在，请重新输入')
		var commercial = new CommercialModel(req.body)
		commercial.save((err, doc) => {
			if (err)
				return res.ef('商户添加失败')
			res.sf({}, '商户添加成功')
		})
	})
})

router.post('/edit', (req, res, next) => {
	CommercialModel.updateOne({
		_id: req.body.id
	}, {
		$set: {
			name: req.body.name,
			type: req.body.type,
			contacts: req.body.contacts,
			phone: req.body.phone,
			address: req.body.address,
			enterTime: req.body.enterTime
		}
	}).then(r => {
		res.sf({}, '商户编辑成功')
	}).catch(err => {
		return res.ef('商户不存在')
	})
})

router.post('/delete', (req, res, next) => {
	CommercialModel.deleteOne({
		_id: req.body.id
	}).then(r => {
		res.sf({}, '商户删除成功')
	}).catch(err => {
		console.log(err);
		return res.ef('商户不存在')
	})
})

module.exports = router