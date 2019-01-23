var express = require('express')
var router = express.Router()
var InStoreModel = require('../db/modules/inStore.js')
var UserModel = require('../db/modules/user.js')
var BrandModel = require('../db/modules/brand.js')
var VersionModel = require('../db/modules/version.js')
var CommercialModel = require('../db/modules/commercial.js')
var StoreModel = require('../db/modules/store.js')

function getExample(res) {
	return res.map(r => {
		return {
			key: r._id,
			value: r.name
		}
	})
}

router.get('/list', async (req, res, next) => {
	let response = {
		userList: await UserModel.find({
			$nor: [{
				account: /^admin$/
			}]
		}).then(r => getExample(r)),
		brandList: await BrandModel.find({}).then(r => getExample(r)),
		versionList: await VersionModel.find({}).then(r => getExample(r)),
		commercialList: await CommercialModel.find({}).then(r => getExample(r)),
		storeList: await StoreModel.find({}).then(r => getExample(r))
	}
	res.sf(response)
})

module.exports = router