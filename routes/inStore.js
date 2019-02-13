var express = require('express')
var router = express.Router()
var InStore = require('../models/InStore.js')
var InStoreModel = require('../db/modules/inStore.js')

function filterFn(query, c) {
	if (query.version && query.version != c.version)
		return false
	if (query.brand && query.brand != c.brand)
		return false
	if (query.commercial && query.commercial != c.commercial)
		return false
	if (query.store && query.store != c.store)
		return false
	if (query.user && query.user != c.user)
		return false
	if (query.begin && query.end && (c.inTime < query.begin || c.inTime >= query.end))
		return false
	return true
}

router.get('/getList', (req, res, next) => {
	var query = req.query
	InStoreModel.find({}).populate([{
		path: 'version'
	}, {
		path: 'brand'
	}, {
		path: 'commercial'
	}, {
		path: 'store'
	}, {
		path: 'user'
	}]).sort({
		'inTime': -1
	}).then(r => {
		let arr = r.map(c => {
			return new InStore(c)
		}).filter(c => {
			return filterFn(query, c)
		})
		res.sf({
			total: arr.length,
			items: arr.slice((query.pageNo - 1) * query.pageSize, query.pageNo * query.pageSize)
		})
	}).catch(err => {
		res.ef('获取入库单详情列表失败')
	})
})

// router.get('/view', async (req, res, next) => {
// 	var query = req.query
// 	if (!query.id)
// 		return res.sf(new InStore())
// 	InStoreModel.findById(query.id).populate([{
// 		path: 'version'
// 	}, {
// 		path: 'brand'
// 	}, {
// 		path: 'commercial'
// 	}, {
// 		path: 'store'
// 	}, {
// 		path: 'user'
// 	}]).then(r => {
// 		res.sf(new InStore(r))
// 	}).catch(err => {
// 		console.log(err);
// 	})
// })

module.exports = router