var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//品牌
var BrandSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	logo: {
		type: [],
		required: true
	}
}, {
	timestamps: true
})

module.exports = mongoose.model('Brand', BrandSchema)