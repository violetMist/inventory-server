var sessionFactory = {}
var sessionList = {}

sessionFactory.init = function(id, user) {
	if (!sessionList[id])
		sessionList[id] = user
}
sessionFactory.getInstance = function() {
	return sessionList
}
sessionFactory.checkSession = function(id) {
	return id && sessionList[id]
}
sessionFactory.clearSession = function(id) {
	if (sessionList[id])
		delete sessionList[id]
}

module.exports = sessionFactory;