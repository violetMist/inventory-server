var express = require('express')
var router = express.Router()
var Brand = require('../models/Brand.js')
var BrandModel = require('../db/modules/brand.js')

router.get('/getList', (req, res, next) => {
	var query = req.query
	BrandModel.find({}).then(r => {
		res.sf({
			total: r.length,
			items: r.slice((query.pageNo - 1) * query.pageSize, query.pageNo * query.pageSize).map(c => {
				return new Brand(c)
			})
		})
	}).catch(err => {
		console.log(err);
	})
})

router.get('/view', (req, res, next) => {
	var query = req.query
	if (query.id) {
		BrandModel.findById(query.id).then(r => {
			res.sf(new Brand(r))
		}).catch(err => {
			res.ef('品牌不存在')
		})
	} else {
		res.sf(new Brand())
	}
})

router.post('/add', (req, res, next) => {
	BrandModel.findOne({
		name: req.body.name
	}).then(r => {
		if (r)
			return res.ef('品牌名已存在，请重新输入')
		var brand = new BrandModel(req.body)
		brand.save((err, doc) => {
			if (err)
				return res.ef('品牌添加失败')
			res.sf({}, '品牌添加成功')
		})
	})
})

router.post('/edit', (req, res, next) => {
	BrandModel.findOne({
		name: req.body.name
	}).then(r => {
		if (r && r.id != req.body.id)
			return res.ef('品牌名已存在，请重新输入')
		BrandModel.updateOne({
			_id: req.body.id
		}, {
			$set: {
				name: req.body.name,
				logo: req.body.logo
			}
		}).then(r => {
			res.sf({}, '品牌编辑成功')
		}).catch(err => {
			return res.ef('品牌不存在')
		})
	})
})

router.post('/delete', (req, res, next) => {
	BrandModel.deleteOne({
		_id: req.body.id
	}).then(r => {
		res.sf({}, '品牌删除成功')
	}).catch(err => {
		console.log(err);
		return res.ef('品牌不存在')
	})
})

module.exports = router