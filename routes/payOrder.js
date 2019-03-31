var express = require('express')
var router = express.Router()
var InStore = require('../models/InStore.js')
var InStoreModel = require('../db/modules/inStore.js')
var PayOrder = require('../models/PayOrder.js')
var PayOrderModel = require('../db/modules/payOrder.js')
var InventoryModel = require('../db/modules/inventory.js')

var _ = require('lodash')
var BrandModel = require('../db/modules/brand.js')
var StoreModel = require('../db/modules/store.js')
var VersionModel = require('../db/modules/version.js')

function filterFn(query, c) {
	if (query.commercial && query.commercial != c.commercial)
		return false
	if (query.user && query.user != c.user)
		return false
	if (query.begin && query.end && (c.inTime < query.begin || c.inTime >= query.end))
		return false
	return true
}

const getOrder = async (query, res) => {
	return await PayOrderModel.findById(query.id).populate([{
		path: 'store'
	}, {
		path: 'commercial'
	}, {
		path: 'user'
	}]).catch(err => {
		console.log(err);
		res.ef('获取信息失败')
	})
}

const getList = async (payOrder, res) => {
	return await InStoreModel.find({
		$or: payOrder.list.map(l => {
			return {
				_id: l
			}
		})
	}).populate([{
		path: 'version'
	}, {
		path: 'brand'
	}, {
		path: 'commercial'
	}, {
		path: 'store'
	}, {
		path: 'user'
	}]).catch(err => {
		console.log(err);
		res.ef('获取信息失败')
	})
}

const insertInStore = async (data, res) => {
	let arr = data.list.map(r => {
		return Object.assign({}, r, {
			commercial: data.commercial,
			store: data.store,
			user: data.user,
			inTime: data.inTime
		})
	})
	return await InStoreModel.insertMany(arr).catch(err => {
		console.log(err);
		return res.ef('入库单创建失败')
	})
}

const saveOrder = async (data, list, res) => {
	let isOK = true
	let payOrder = new PayOrderModel(Object.assign({}, data, {
		list: list
	}))
	await payOrder.save().catch(err => {
		isOK = false
		console.log(err);
		return res.ef('入库单创建失败')
	})
	return isOK
}

const delInStore = async (list, res) => {
	let isOK = true
	const delFn = async doc => {
		let one = await InStoreModel.findById(doc.id).catch(err => {
			isOK = false
			console.log(err);
		})
		await one.remove()
	}
	for (var i = 0; i < list.length; i++) {
		if (!isOK) return
		delFn(list[i])
	}
	return isOK
}

const checkFn = async list => {
	let arr = repetition(list)
	let check = await InventoryModel.checkRepertory(arr)
	if (check.status == 0)
		return {
			status: 0,
			message: '型号：' + check.data.version.name +
				'，品牌：' + check.data.brand.name +
				'，所在仓库：' + check.data.store.name +
				'，的轴承，已经有过出库记录，入库单不可编辑'
		}
	if (check.status == -1) {
		let brand = await BrandModel.findById(check.data.brand)
		let version = await VersionModel.findById(check.data.version)
		let store = await StoreModel.findById(check.data.store)
		return {
			status: 0,
			message: '库存中没有型号：' + version.name +
				'，品牌：' + brand.name +
				'，所在仓库：' + store.name + ', 的轴承，请重新填写'
		}
	}
	return {
		status: 1,
		message: ''
	}
}

const repetition = list => {
	let obj = {}
	let arr = []
	list.forEach((l, idx) => {
		let c = _.clone(l)
		let key = c.version + '-' + c.brand
		if (obj[key]) {
			obj[key].number += Number(c.number)
		} else {
			c.number = Number(c.number)
			obj[key] = c
			arr.push(obj[key])
		}
	})
	return arr
}

router.get('/getList', (req, res, next) => {
	var query = req.query
	PayOrderModel.find({}).sort({
		'inTime': -1
	}).populate([{
		path: 'store'
	}, {
		path: 'commercial'
	}, {
		path: 'user'
	}]).then(r => {
		let arr = r.map(c => {
			return new PayOrder(c)
		}).filter(c => {
			return filterFn(query, c)
		})
		res.sf({
			total: arr.length,
			items: arr.slice((query.pageNo - 1) * query.pageSize, query.pageNo * query.pageSize)
		})
	}).catch(err => {
		console.log(err);
		res.ef('获取入库单列表失败')
	})
})

router.get('/view', async (req, res, next) => {
	var query = req.query
	if (!query.id)
		return res.sf(new PayOrder())
	let order = await getOrder(query, res)
	let list = await getList(order, res)
	let response = new PayOrder(order)
	response.setList(list.map(c => {
		return new InStore(c)
	}))
	res.sf(response)
})

router.post('/add', async (req, res, next) => {
	if (!req.body.list.length)
		return res.ef('型号内容不能为空，入库单创建失败')
	//创建入库单详情
	let list = await insertInStore(req.body, res)
	if (!list.length) return
	//创建入库单
	let saveOK = await saveOrder(req.body, list, res)
	if (!saveOK) return
	//更新库存
	let isOK = await InventoryModel.add(list)
	if (!isOK)
		return res.ef('入库单创建失败')
	res.sf({}, '入库单创建成功')
})

router.post('/edit', async (req, res, next) => {
	if (!req.body.list.length)
		return res.ef('型号内容不能为空，入库单修改失败')
	let order = await getOrder(req.body, res)
	let oldList = await getList(order, res)

	let result = await checkFn(oldList)
	if (!result.status)
		return res.ef(result.message)

	//删除库存
	let delInventory = await InventoryModel.del(oldList)
	if (!delInventory)
		return res.ef('库存不足')

	//删除入库单
	await order.remove()
	//删除入库单详情
	let delStore = await delInStore(oldList)
	if (!delStore)
		return res.ef('入库单修改失败')

	//创建入库单详情
	let list = await insertInStore(req.body, res)
	if (!list.length) return
	//创建入库单
	let saveOK = await saveOrder(req.body, list, res)
	if (!saveOK) return
	//更新库存
	let isOK = InventoryModel.add(list)
	if (!isOK)
		return res.ef('入库单修改失败')
	res.sf({}, '入库单修改成功')
})

router.post('/delete', async (req, res, next) => {
	let order = await getOrder(req.body, res)
	let oldList = await getList(order, res)

	let result = await checkFn(oldList)
	if (!result.status)
		return res.ef(result.message)
	//删除库存
	let delInventory = await InventoryModel.del(oldList)
	if (!delInventory)
		return res.ef('入库单删除失败')
	//删除入库单
	await order.remove()
	//删除入库单详情
	let delStore = await delInStore(oldList)
	if (!delStore)
		return res.ef('入库单删除失败')
	res.sf({}, '入库单删除成功')
})

module.exports = router