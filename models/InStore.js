class InStore {
	constructor(s) {
		if (s) {
			this.id = s.id
			this.version = s.version.id
			this.versionName = s.version.name
			this.brand = s.brand.id
			this.brandName = s.brand.name
			this.commercial = s.commercial.id
			this.commercialName = s.commercial.name
			this.user = s.user.id
			this.userName = s.user.name
			this.store = s.store.id
			this.storeName = s.store.name
			this.number = s.number
			this.price = s.price
			this.inTime = new Date(s.inTime).getTime()
			this.total = s.total
		} else {
			this.version = ''
			this.brand = ''
			this.number = ''
			this.price = ''
			this.total = 0
		}
	}
}

module.exports = InStore