var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//库存项
var InventorySchema = new Schema({
	number: { //数量
		type: Number,
		required: true
	},
	brand: { //品牌
		type: Schema.Types.ObjectId,
		ref: 'Brand'
	},
	version: { //型号
		type: Schema.Types.ObjectId,
		ref: 'Version'
	},
	store: { //所在仓库
		type: Schema.Types.ObjectId,
		ref: 'Store'
	}
}, {
	timestamps: true
})

InventorySchema.statics.add = async function(list) {
	let isOK = true
	const addFn = async l => {
		let one = await this.findOne({
			version: l.version,
			brand: l.brand,
			store: l.store
		}).catch(err => {
			isOK = false
			console.log(err);
		})
		if (!one) {
			await this.create(Object.assign({}, {
				version: l.version,
				brand: l.brand,
				store: l.store,
				number: l.number
			})).catch(err => {
				isOK = false
				console.log(err);
			})
		} else {
			one.number += l.number
			await one.save().catch(err => {
				isOK = false
				console.log(err);
			})
		}
	}
	for (var i = 0; i < list.length; i++) {
		await addFn(list[i])
	}
	return isOK
}

InventorySchema.statics.del = async function(list) {
	let isOK = true
	const delFn = async l => {
		let one = await this.findOne({
			version: l.version,
			brand: l.brand,
			store: l.store
		}).catch(err => {
			isOK = false
			console.log(err);
		})
		one.number -= l.number
		await one.save().catch(err => {
			isOK = false
			console.log(err);
		})
	}
	for (var i = 0; i < list.length; i++) {
		await delFn(list[i])
	}
	return isOK
}

InventorySchema.statics.checkNumber = async function(list) {
	let status = 1
	let data = null
	const checkFn = async l => {
		let one = await this.findOne({
			version: l.version,
			brand: l.brand,
			store: l.store
		}).populate([{
			path: 'version'
		}, {
			path: 'brand'
		}, {
			path: 'store'
		}]).catch(err => {
			status = -1 //没有库存
			data = l
			console.log(err);
		})
		if (!one) {
			data = l //没有库存
			return status = -1
		}
		if (one.number < l.number) {
			data = one //库存量不足
			return status = 0
		}
	}
	for (var i = 0; i < list.length; i++) {
		if (status != 1)
			return {
				status: status,
				data: data
			}
		await checkFn(list[i])
	}
	return {
		status: status,
		data: data
	}
}

module.exports = mongoose.model('Inventory', InventorySchema)