var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//入库
var SellOrderSchema = new Schema({
	outTime: { //出库时间
		type: Date,
		required: true
	},
	commercial: { //买家
		type: Schema.Types.ObjectId,
		ref: 'Commercial'
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	list: [{
		type: Schema.Types.ObjectId,
		ref: 'outStore'
	}]
}, {
	timestamps: true
})

module.exports = mongoose.model('SellOrder', SellOrderSchema)