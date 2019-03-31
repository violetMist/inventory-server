const constant = {
	systemRoles: [{
		id: 1,
		label: '型号管理',
		roles: [{
			id: 11,
			label: '型号查看',
			roles: []
		}, {
			id: 12,
			label: '型号添加',
			roles: []
		}, {
			id: 13,
			label: '型号编辑',
			roles: []
		}]
	}, {
		id: 2,
		label: '品牌管理',
		roles: [{
			id: 21,
			label: '品牌查看',
			roles: []
		}, {
			id: 22,
			label: '品牌添加',
			roles: []
		}, {
			id: 23,
			label: '品牌编辑',
			roles: []
		}]
	}, {
		id: 3,
		label: '商户管理',
		roles: [{
			id: 31,
			label: '商户查看',
			roles: []
		}, {
			id: 32,
			label: '商户添加',
			roles: []
		}, {
			id: 33,
			label: '商户编辑',
			roles: []
		}]
	}, {
		id: 4,
		label: '库存查看',
		roles: []
	}, {
		id: 5,
		label: '入库管理',
		roles: [{
			id: 51,
			label: '入库查看',
			roles: []
		}, {
			id: 52,
			label: '入库添加',
			roles: []
		}, {
			id: 53,
			label: '入库编辑',
			roles: []
		}]
	}, {
		id: 6,
		label: '出库管理',
		roles: [{
			id: 61,
			label: '出库查看',
			roles: []
		}, {
			id: 62,
			label: '出库添加',
			roles: []
		}, {
			id: 63,
			label: '出库编辑',
			roles: []
		}]
	}, {
		id: 7,
		label: '用户管理',
		roles: [{
			id: 71,
			label: '用户查看',
			roles: []
		}, {
			id: 72,
			label: '用户添加',
			roles: []
		}, {
			id: 73,
			label: '用户编辑',
			roles: []
		}]
	}, {
		id: 8,
		label: '仓库管理',
		roles: [{
			id: 81,
			label: '仓库查看',
			roles: []
		}, {
			id: 82,
			label: '仓库添加',
			roles: []
		}, {
			id: 83,
			label: '仓库编辑',
			roles: []
		}]
	}],
	bearingType: [{
		key: '1',
		value: '深沟球轴承'
	}, {
		key: '2',
		value: '调心球轴承'
	}, {
		key: '3',
		value: '圆柱滚子轴承'
	}, {
		key: '4',
		value: '调心滚子轴承'
	}, {
		key: '5',
		value: '滚针轴承'
	}, {
		key: '6',
		value: '角接触球轴承'
	}, {
		key: '7',
		value: '圆锥滚子轴承'
	}, {
		key: '8',
		value: '推力球轴承'
	}, {
		key: '9',
		value: '推力调心滚子轴承'
	}, {
		key: '10',
		value: '带座外球面轴承'
	}, {
		key: '11',
		value: '外球面球轴承'
	}, {
		key: '12',
		value: '外球面轴承座'
	}, {
		key: '13',
		value: '剖分式轴承座'
	}, {
		key: '14',
		value: '铸钢类轴承座'
	}, {
		key: '15',
		value: '进口轴承'
	}, {
		key: '16',
		value: '关节轴承'
	}, {
		key: '17',
		value: '直线轴承'
	}, {
		key: '18',
		value: '塑料轴承'
	}, {
		key: '19',
		value: '自润滑轴承'
	}, {
		key: '20',
		value: '不锈钢轴承'
	}, {
		key: '21',
		value: '丝杠类轴承'
	}, {
		key: '22',
		value: '导轨类轴承'
	}, {
		key: '23',
		value: '回转支撑类轴承'
	}, {
		key: '24',
		value: '耐高温/耐低温轴承'
	}, {
		key: '25',
		value: '特殊类型轴承'
	}, {
		key: '26',
		value: '紧定套'
	}, {
		key: '27',
		value: '油封'
	}, {
		key: '28',
		value: '润滑脂'
	}],
	unitType: [{
		key: '1',
		value: '个'
	}, {
		key: '2',
		value: '套'
	}, {
		key: '3',
		value: '根'
	}, {
		key: '4',
		value: '米'
	}],
	commercialType: [{
		key: '1',
		value: '供应商'
	}, {
		key: '2',
		value: '买家'
	}]
}

module.exports = constant