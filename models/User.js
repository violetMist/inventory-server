class User {
	constructor(user) {
		if (user) {
			this.id = user.id
			this.name = user.name
			this.phone = user.phone
			this.account = user.account
			this.password = user.password
			this.roles = user.roles
			this.createTime = new Date(user.createdAt).getTime()
			this.updateTime = new Date(user.updatedAt).getTime()
		} else {
			this.name = ''
			this.phone = ''
			this.account = ''
			this.password = ''
			this.roles = []
		}
	}
}
module.exports = User