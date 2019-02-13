var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//入库
var PayOrderSchema = new Schema({
	inTime: { //入库时间
		type: Date,
		required: true
	},
	store: { //仓库
		type: Schema.Types.ObjectId,
		ref: 'Store'
	},
	commercial: { //供应商
		type: Schema.Types.ObjectId,
		ref: 'Commercial'
	},
	user: { //填写人
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	list: [{
		type: Schema.Types.ObjectId,
		ref: 'InStore'
	}]
}, {
	timestamps: true
})

module.exports = mongoose.model('PayOrder', PayOrderSchema)