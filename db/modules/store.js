var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//仓库表
var StoreSchema = new Schema({
	name: { //仓库名
		type: String,
		required: true
	},
	address: {
		type: String,
		required: true
	}
}, {
	timestamps: true
})

module.exports = mongoose.model('Store', StoreSchema)