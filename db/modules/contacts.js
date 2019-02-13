var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//联系人
var ContactsSchema = new Schema({
	contacts: {
		type: String,
		required: true
	},
	phone: {
		type: Number,
		required: true
	}
}, {
	timestamps: true
})

module.exports = mongoose.model('Contacts', ContactsSchema)