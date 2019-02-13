var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//入库
var InStoreSchema = new Schema({
	number: { //数量
		type: Number,
		required: true
	},
	price: { //单价
		type: Number
	},
	total: {
		type: String
	},
	inTime: { //入库时间
		type: Date,
		required: true
	},
	commercial: { //供应商编号
		type: Schema.Types.ObjectId,
		ref: 'Commercial'
	},
	brand: { //品牌
		type: Schema.Types.ObjectId,
		ref: 'Brand'
	},
	version: { //型号
		type: Schema.Types.ObjectId,
		ref: 'Version'
	},
	store: { //仓库编号
		type: Schema.Types.ObjectId,
		ref: 'Store'
	},
	user: { //接收人
		type: Schema.Types.ObjectId,
		ref: 'User'
	}
}, {
	timestamps: true
})

module.exports = mongoose.model('InStore', InStoreSchema)