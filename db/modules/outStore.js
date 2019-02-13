var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//出库
var OutStoreSchema = new Schema({
	number: { //数量
		type: Number,
		required: true
	},
	price: { //单价
		type: Number
	},
	total: { //金额
		type: String
	},
	outTime: { //出库时间
		type: Date,
		required: true
	},
	commercial: { //买家
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
	user: { //出货人
		type: Schema.Types.ObjectId,
		ref: 'User'
	}
}, {
	timestamps: true
})

module.exports = mongoose.model('OutStore', OutStoreSchema)

var mongoose = require('mongoose');
var Schema = mongoose.Schema;