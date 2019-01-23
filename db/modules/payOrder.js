var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//入库
var PayOrderSchema = new Schema({
	inTime: { //入库时间
		type: Date,
		required: true
	},
	user: { //接收人
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