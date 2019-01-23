var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//用户
var UserSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	account: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	phone: {
		type: Number,
		required: true
	},
	roles: [Number]
}, {
	timestamps: true
})

module.exports = mongoose.model('User', UserSchema)