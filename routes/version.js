var express = require('express')
var router = express.Router()
var Version = require('../models/Version.js')
var VersionModel = require('../db/modules/version.js')

router.get('/getList', (req, res, next) => {
	var query = req.query
	VersionModel.find({
		type: new RegExp(query.type)
	}).then(r => {
		res.sf({
			total: r.length,
			items: r.slice((query.pageNo - 1) * query.pageSize, query.pageNo * query.pageSize).map(c => {
				return new Version(c)
			})
		})
	}).catch(err => {
		res.ef('型号不存在')
	})
})

router.get('/view', (req, res, next) => {
	var query = req.query
	if (query.id) {
		VersionModel.findById(query.id).then(r => {
			res.sf(new Version(r))
		}).catch(err => {
			res.ef('型号不存在')
		})
	} else {
		res.sf(new Version())
	}
})

router.post('/add', (req, res, next) => {
	VersionModel.findOne({
		name: req.body.name
	}).then(r => {
		if (r)
			return res.ef('型号已存在，请重新输入')
		var version = new VersionModel(req.body)
		version.save((err, doc) => {
			if (err)
				return res.ef('型号添加失败')
			res.sf({}, '型号添加成功')
		})
	})
})

router.post('/edit', (req, res, next) => {
	VersionModel.findOne({
		name: req.body.name
	}).then(r => {
		if (r && r.id != req.body.id)
			return res.ef('型号已存在，请重新输入')
		VersionModel.updateOne({
			_id: req.body.id
		}, {
			$set: {
				name: req.body.name,
				oldName: req.body.oldName,
				innerDiameter: req.body.innerDiameter,
				outsideDiameter: req.body.outsideDiameter,
				width: req.body.width,
				weight: req.body.weight
			}
		}).then(r => {
			res.sf({}, '型号编辑成功')
		}).catch(err => {
			return res.ef('型号不存在')
		})
	})
})

router.post('/delete', (req, res, next) => {
	VersionModel.deleteOne({
		_id: req.body.id
	}).then(r => {
		res.sf({}, '型号删除成功')
	}).catch(err => {
		console.log(err);
		return res.ef('型号不存在')
	})
})

module.exports = router