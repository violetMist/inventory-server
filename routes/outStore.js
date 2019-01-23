var express = require('express')
var router = express.Router()
var OutStore = require('../models/OutStore.js')
var outStoreModel = require('../db/modules/outStore.js')

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
	if (query.begin && query.end && (c.outTime < query.begin || c.outTime >= query.end))
		return false
	return true
}

router.get('/getList', (req, res, next) => {
	var query = req.query
	outStoreModel.find({}).populate([{
		path: 'version'
	}, {
		path: 'brand'
	}, {
		path: 'commercial'
	}, {
		path: 'store'
	}, {
		path: 'user'
	}]).then(r => {
		let arr = r.map(c => {
			return new OutStore(c)
		}).filter(c => {
			return filterFn(query, c)
		})
		res.sf({
			total: arr.length,
			items: arr.slice((query.pageNo - 1) * query.pageSize, query.pageNo * query.pageSize)
		})
	}).catch(err => {
		res.ef('获取出库单详情列表失败')
	})
})

// router.get('/view', async (req, res, next) => {
// 	var query = req.query
// 	if (!query.id)
// 		return res.sf(new OutStore())
// 	outStoreModel.findById(query.id).populate([{
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
// 		res.sf(new OutStore(r))
// 	}).catch(err => {
// 		console.log(err);
// 	})
// })

module.exports = router