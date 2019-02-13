var Contacts = require('./Contacts.js')

class Commercial {
	constructor(commercial) {
		if (commercial) {
			this.id = commercial.id
			this.name = commercial.name
			this.type = commercial.type
			this.address = commercial.address
			this.enterTime = new Date(commercial.enterTime).getTime()
		} else {
			this.name = ''
			this.type = ''
			this.list = [new Contacts()]
			this.address = ''
			this.enterTime = ''
		}
	}
	setList(list) {
		this.list = list
	}
}
module.exports = Commercial