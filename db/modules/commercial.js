var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//商户
var CommercialSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	type: {
		type: String,
		required: true
	},
	address: {
		type: String,
		required: true
	},
	enterTime: {
		type: Date,
		required: true
	},
	list: [{
		type: Schema.Types.ObjectId,
		ref: 'Contacts'
	}]
}, {
	timestamps: true
})

module.exports = mongoose.model('Commercial', CommercialSchema)