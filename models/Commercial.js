class Commercial {
	constructor(commercial) {
		if (commercial) {
			this.id = commercial.id
			this.name = commercial.name
			this.type = commercial.type
			this.contacts = commercial.contacts
			this.phone = commercial.phone
			this.address = commercial.address
			this.enterTime = new Date(commercial.enterTime).getTime()
		} else {
			this.name = ''
			this.type = ''
			this.contacts = ''
			this.phone = ''
			this.address = ''
			this.enterTime = ''
		}
	}
}
module.exports = Commercial