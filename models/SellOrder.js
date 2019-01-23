var OutStore = require('./OutStore.js')

class SellOrder {
	constructor(s) {
		if (s) {
			this.id = s.id
			this.outTime = new Date(s.outTime).getTime()
			this.commercial = s.commercial.id
			this.commercialName = s.commercial.name
			this.user = s.user.id
			this.userName = s.user.name
		} else {
			this.user = ''
			this.commercial = ''
			this.outTime = ''
			this.list = [new OutStore()]
		}
	}
	setList(list) {
		this.list = list
	}
}

module.exports = SellOrder