var express = require('express')
var router = express.Router()
var Store = require('../models/Store.js');
var StoreModel = require('../db/modules/store.js')

router.get('/getList', (req, res, next) => {
	var query = req.query
	StoreModel.find({}).sort({
		'createdAt': 1
	}).then(r => {
		res.sf({
			total: r.length,
			items: r.slice((query.pageNo - 1) * query.pageSize, query.pageNo * query.pageSize).map(c => {
				return new Store(c)
			})
		})
	}).catch(err => {
		res.ef('仓库查询失败')
	})
})

router.get('/view', (req, res, next) => {
	var query = req.query
	if (!query.id)
		return res.sf(new Store())
	StoreModel.findById(query.id).then(r => {
		res.sf(new Store(r))
	}).catch(err => {
		res.ef('仓库不存在')
	})
})

router.post('/add', (req, res, next) => {
	StoreModel.findOne({
		name: req.body.name
	}).then(r => {
		if (r)
			return res.ef('仓库名已经存在，请重新输入')
		var store = new StoreModel(req.body)
		store.save(err => {
			if (err)
				return res.ef('仓库添加失败')
			res.sf({}, '仓库添加成功')
		})
	})
})

router.post('/edit', (req, res, next) => {
	StoreModel.findOne({
		name: req.body.name
	}).then(r => {
		if (r && r.id != req.body.id)
			return res.ef('仓库名已存在，请重新输入')
		StoreModel.updateOne({
			_id: req.body.id
		}, {
			$set: {
				name: req.body.name,
				address: req.body.address
			}
		}).then(r => {
			res.sf({}, '仓库编辑成功')
		}).catch(err => {
			return res.ef('仓库不存在')
		})
	})
})

router.post('/delete', (req, res, next) => {
	StoreModel.deleteOne({
		_id: req.body.id
	}).then(r => {
		res.sf({}, '仓库删除成功')
	}).catch(err => {
		console.log(err);
		return res.ef('仓库不存在')
	})
})

module.exports = router