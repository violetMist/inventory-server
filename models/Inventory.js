class Inventory {
	constructor(s) {
		this.id = s.id
		this.version = s.version.id
		this.versionName = s.version.name
		this.brand = s.brand.id
		this.brandName = s.brand.name
		this.store = s.store.id
		this.storeName = s.store.name
		this.number = s.number
	}
}

module.exports = Inventory