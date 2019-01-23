class Brand {
	constructor(brand) {
		if (brand) {
			this.id = brand.id
			this.name = brand.name
			this.logo = brand.logo
			this.ceateTime = new Date(brand.createdAt).getTime()
			this.updateTime = new Date(brand.updatedAt).getTime()
		} else {
			this.name = ''
			this.logo = []
		}
	}
}
module.exports = Brand