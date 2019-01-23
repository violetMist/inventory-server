class Store {
	constructor(store) {
		if (store) {
			this.id = store.id
			this.name = store.name
			this.address = store.address
		} else {
			this.name = ''
			this.address = ''
		}
	}
}

module.exports = Store