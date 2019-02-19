var express = require('express')
var router = express.Router()
var _ = require('lodash')
var Inventory = require('../models/Inventory.js')
var InventoryModel = require('../db/modules/inventory.js')

function filterFn(query, c) {
	if (query.type && query.type != c.type)
		return false
	if (query.version && query.version != c.version)
		return false
	if (query.brand && query.brand != c.brand)
		return false
	if (query.store && query.store != c.store)
		return false
	return true
}

router.get('/getList', (req, res, next) => {
	var query = req.query
	InventoryModel.find({}).populate([{
		path: 'version'
	}, {
		path: 'brand'
	}, {
		path: 'store'
	}]).then(r => {
		let arr = r.map(c => {
			return new Inventory(c)
		}).filter(c => {
			return filterFn(query, c)
		}).sort(function(a, b) {
			let x = parseInt(a.versionName)
			let y = parseInt(b.versionName)
			if (_.isNaN(x) || _.isNaN(y)) {
				if (a.versionName > b.versionName)
					return 1
				if (a.versionName < b.versionName)
					return -1
				return 0
			}
			return x - y
		})
		res.sf({
			total: arr.length,
			items: arr.slice((query.pageNo - 1) * query.pageSize, query.pageNo * query.pageSize)
		})
	}).catch(err => {
		res.ef('获取库存列表失败')
	})
})

router.get('/getNumber', (req, res, next) => {
	var query = req.query
	InventoryModel.find({
		store: query.store,
		version: query.version,
		brand: query.brand
	}).then(r => {
		res.sf({
			stock: r.length ? r[0].number : 0
		})
	}).catch(err => {
		res.ef('获取库存数量失败')
	})
})

module.exports = router