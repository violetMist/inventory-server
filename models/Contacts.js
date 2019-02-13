class Contacts {
	constructor(s) {
		if (s) {
			this.id = s.id
			this.contacts = s.contacts
			this.phone = s.phone
		} else {
			this.contacts = ''
			this.phone = ''
		}
	}
}

module.exports = Contacts