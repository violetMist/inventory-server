var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//型号
var VersionSchema = new Schema({
	type: { //类型
		type: String,
		required: true
	},
	name: { //国内新型号
		type: String,
		required: true
	},
	oldName: { //国内旧型号
		type: String,
		required: true
	},
	innerDiameter: { //内径
		type: Number,
		required: true
	},
	outsideDiameter: { //外径
		type: Number,
		required: true
	},
	width: { //宽度
		type: Number,
		required: true
	},
	weight: { //重量
		type: Number,
		required: true
	}
}, {
	timestamps: true
})

module.exports = mongoose.model('Version', VersionSchema)