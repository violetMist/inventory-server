var express = require('express')
var router = express.Router()
var Commercial = require('../models/Commercial.js')
var CommercialModel = require('../db/modules/commercial.js')
var Contacts = require('../models/Contacts.js')
var ContactsModel = require('../db/modules/contacts.js')

const insertContacts = async (data, res) => {
	return await ContactsModel.insertMany(data.list).catch(err => {
		console.log(err);
		return res.ef('联系人创建失败')
	})
}

const saveCommercial = async (data, list, res) => {
	let isOK = true
	let Commercial = new CommercialModel(Object.assign({}, data, {
		list: list
	}))
	await Commercial.save().catch(err => {
		isOK = false
		console.log(err);
		return res.ef('商户创建失败')
	})
	return isOK
}

const getCommercial = async (query, res) => {
	return await CommercialModel.findById(query.id).catch(err => {
		console.log(err);
		res.ef('获取信息失败')
	})
}

const getList = async (commercial, res) => {
	if (!commercial.list || !commercial.list.length)
		return []
	return await ContactsModel.find({
		$or: commercial.list.map(l => {
			return {
				_id: l
			}
		})
	}).catch(err => {
		console.log(err);
		res.ef('获取信息失败')
	})
}

const delContacts = async (list, res) => {
	let isOK = true
	const delFn = async doc => {
		let one = await ContactsModel.findById(doc.id).catch(err => {
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
	CommercialModel.find({
		name: new RegExp(query.name),
		type: new RegExp(query.type)
	}).sort({
		'_id': -1
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

router.get('/view', async (req, res, next) => {
	var query = req.query
	if (!query.id)
		return res.sf(new Commercial())
	let commercial = await getCommercial(query, res)
	if (!commercial.list || !commercial.list.length)
		return res.sf(Object.assign({}, new Commercial(commercial), {
			list: [new Contacts()]
		}))
	let list = await getList(commercial, res)
	let response = new Commercial(commercial)
	response.setList(list.map(c => {
		return new Contacts(c)
	}))
	res.sf(response)
})

router.post('/add', async (req, res, next) => {
	if (!req.body.list.length)
		return res.ef('联系人/电话不能为空，商户创建失败')
	let r = await CommercialModel.findOne({
		name: req.body.name
	})
	if (r)
		return res.ef('商户名已存在，请重新输入')
	//创建联系人详情
	let list = await insertContacts(req.body, res)
	if (!list.length) return
	//创建商户
	let saveOK = await saveCommercial(req.body, list, res)
	if (!saveOK) return
	res.sf({}, '商户添加成功')
})

router.post('/edit', async (req, res, next) => {
	if (!req.body.list.length)
		return res.ef('联系人/电话不能为空，入库单修改失败')
	let r = await CommercialModel.findOne({
		name: req.body.name
	})
	if (r.id != req.body.id)
		return res.ef('商户名已存在，请重新输入')
	let commercial = await getCommercial(req.body, res)
	let oldList = await getList(commercial, res)
	//删除商户
	await commercial.remove()
	//删除联系人
	let delStore = await delContacts(oldList)
	if (!delStore)
		return res.ef('商户修改失败')

	//创建联系人
	let list = await insertContacts(req.body, res)
	if (!list.length) return
	//创建商户
	let saveOK = await saveCommercial(req.body, list, res)
	if (!saveOK) return
	res.sf({}, '商户编辑成功')
})

router.post('/delete', async (req, res, next) => {
	let commercial = await getCommercial(req.body, res)
	let oldList = await getList(commercial, res)
	//删除商户
	await commercial.remove()
	//删除联系人
	let delStore = await delContacts(oldList)
	if (!delStore)
		return res.ef('商户删除失败')
	res.sf({}, '商户删除成功')
})

module.exports = router