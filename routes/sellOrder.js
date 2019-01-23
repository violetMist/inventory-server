var express = require('express')
var router = express.Router()
var OutStore = require('../models/OutStore.js')
var OutStoreModel = require('../db/modules/outStore.js')
var SellOrder = require('../models/SellOrder.js')
var SellOrderModel = require('../db/modules/sellOrder.js')
var Inventory = require('../models/Inventory.js')
var InventoryModel = require('../db/modules/inventory.js')

function filterFn(query, c) {
	if (query.commercial && query.commercial != c.commercial)
		return false
	if (query.user && query.user != c.user)
		return false
	if (query.begin && query.end && (c.outTime < query.begin || c.outTime >= query.end))
		return false
	return true
}

const getOrder = async (query, res) => {
	return await SellOrderModel.findById(query.id).populate([{
		path: 'commercial'
	}, {
		path: 'user'
	}]).catch(err => {
		console.log(err);
		res.ef('获取信息失败')
	})
}

const getList = async (sellOrder, res) => {
	return await OutStoreModel.find({
		$or: sellOrder.list.map(l => {
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
			user: data.user,
			outTime: data.outTime
		})
	})
	return await OutStoreModel.insertMany(arr).catch(err => {
		console.log(err);
		return res.ef('出库单创建失败')
	})
}

const saveOrder = async (data, list, res) => {
	let isOK = true
	let sellOrder = new SellOrderModel(Object.assign({}, data, {
		list: list
	}))
	await sellOrder.save().catch(err => {
		isOK = false
		console.log(err);
		return res.ef('出库单创建失败')
	})
	return isOK
}

const delInStore = async (list, res) => {
	let isOK = true
	const delFn = async doc => {
		let one = await OutStoreModel.findById(doc.id).catch(err => {
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

router.get('/getList', (req, res, next) => {
	var query = req.query
	SellOrderModel.find({}).populate([{
		path: 'commercial'
	}, {
		path: 'user'
	}]).then(r => {
		let arr = r.map(c => {
			return new SellOrder(c)
		}).filter(c => {
			return filterFn(query, c)
		})
		res.sf({
			total: arr.length,
			items: arr.slice((query.pageNo - 1) * query.pageSize, query.pageNo * query.pageSize)
		})
	}).catch(err => {
		console.log(err);
		res.ef('获取出库单列表失败')
	})
})

router.get('/view', async (req, res, next) => {
	var query = req.query
	if (!query.id)
		return res.sf(new SellOrder())
	let order = await getOrder(query, res)
	let list = await getList(order, res)
	let response = new SellOrder(order)
	response.setList(list.map(c => {
		return new OutStore(c)
	}))
	res.sf(response)
})

router.post('/add', async (req, res, next) => {
	if (!req.body.list.length)
		return res.ef('型号内容不能为空，出库单创建失败')
	let check = await InventoryModel.checkNumber(req.body.list)
	if (check.status == 0)
		return res.ef('型号：' + check.data.version.name +
			'，品牌：' + check.data.brand.name +
			'，所在仓库：' + check.data.store.name +
			'，的轴承库存数量为：' + check.data.number + '，库存数量不足，请重新填写')
	if (check.status == -1) {
		return res.ef('库存中没有所填的产品，出库单创建失败')
	}
	//创建出库单详情
	let list = await insertInStore(req.body, res)
	if (!list.length) return
	//创建出库单
	let saveOK = await saveOrder(req.body, list, res)
	if (!saveOK) return
	//更新库存
	let isOK = await InventoryModel.del(list, res)
	if (!isOK)
		return res.ef('出库单创建失败')
	res.sf({}, '出库单创建成功')
})

router.post('/edit', async (req, res, next) => {
	if (!req.body.list.length)
		return res.ef('型号内容不能为空，出库单修改失败')
	let order = await getOrder(req.body, res)
	let oldList = await getList(order, res)
	//删除入库单
	await order.remove()
	//删除库存
	let delInventory = await InventoryModel.del(oldList)
	if (!delInventory)
		return res.ef('出库单修改失败')
	//删除出库单详情
	let delStore = await delInStore(oldList)
	if (!delStore)
		return res.ef('出库单修改失败')

	//创建出库单详情
	let list = await insertInStore(req.body, res)
	if (!list.length) return
	//创建出库单
	let saveOK = await saveOrder(req.body, list, res)
	if (!saveOK) return
	//更新库存
	let isOK = InventoryModel.add(list, res)
	if (!isOK)
		return res.ef('入库单修改失败')
	res.sf({}, '入库单修改成功')
})

router.post('/delete', (req, res, next) => {

})

module.exports = router