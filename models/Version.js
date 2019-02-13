class Version {
	constructor(version) {
		if (version) {
			this.id = version.id
			this.type = version.type
			this.name = version.name
			this.oldName = version.oldName
			this.innerDiameter = version.innerDiameter
			this.outsideDiameter = version.outsideDiameter
			this.width = version.width
			this.weight = version.weight
			this.unit = version.unit
		} else {
			this.type = ''
			this.name = ''
			this.oldName = ''
			this.innerDiameter = ''
			this.outsideDiameter = ''
			this.width = ''
			this.weight = ''
			this.unit = ''
		}
	}
}
module.exports = Version