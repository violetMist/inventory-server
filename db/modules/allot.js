var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//库存项
var InventorySchema = new Schema({
	amount: { //数量
		type: String,
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
	fromStore: { //调出仓库
		type: Schema.Types.ObjectId,
		ref: 'Store'
	},
	toStore: { //调入仓库
		type: Schema.Types.ObjectId,
		ref: 'Store'
	}
}, {
	timestamps: true
})

module.exports = mongoose.model('Inventory', InventorySchema)