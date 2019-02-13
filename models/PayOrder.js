var InStore = require('./InStore.js')

class PayOrder {
	constructor(s) {
		if (s) {
			this.id = s.id
			this.inTime = new Date(s.inTime).getTime()
			this.store = s.store.id
			this.storeName = s.store.name
			this.commercial = s.commercial.id
			this.commercialName = s.commercial.name
			this.user = s.user.id
			this.userName = s.user.name
		} else {
			this.user = ''
			this.commercial = ''
			this.inTime = ''
			this.list = [new InStore()]
		}
	}
	setList(list) {
		this.list = list
	}
}

module.exports = PayOrder