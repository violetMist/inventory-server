var fs = require('fs')
var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var session = require('express-session')
var multer = require('multer')

var db = require('./db')
var sessionFactory = require('./utils/session.js')
var indexRouter = require('./routes/index.js')
var userRouter = require('./routes/user.js')
var brandRouter = require('./routes/brand.js')
var versionRouter = require('./routes/version.js')
var commercialRouter = require('./routes/commercial.js')
var storeRouter = require('./routes/store.js')
var payOrderRouter = require('./routes/payOrder.js')
var sellOrderRouter = require('./routes/sellOrder.js')
var inStoreRouter = require('./routes/inStore.js')
var outStoreRouter = require('./routes/outStore.js')
var inventoryRouter = require('./routes/inventory.js')
var utilsRouter = require('./routes/utils.js')

//主程序
var app = express()
// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({
	extended: false
}))

app.use(express.static(path.join(__dirname, 'public')))
//设置cookie
app.use(cookieParser())

//设置session
app.use(session({
	////这里的name值得是cookie的name，默认cookie的name是：connect.sid
	//name: 'hhw',
	secret: 'keyboard cat',
	cookie: ('name', 'value', {
		path: '/',
		httpOnly: true,
		secure: false,
		maxAge: 1000 * 60 * 60
	}),
	//重新保存：强制会话保存即使是未修改的。默认为true但是得写上
	resave: true,
	//强制“未初始化”的会话保存到存储。 
	saveUninitialized: true,

}))

app.use((req, res, next) => {
	if (!res.sf) {
		res.sf = (data, message) => {
			return res.json({
				code: 0,
				data: data || {},
				message: message || ''
			})
		}
	}
	if (!res.ef) {
		res.ef = (message, data) => {
			return res.json({
				code: 1,
				data: data || {},
				message: message || ''
			})
		}
	}
	next()
})

//设置跨域访问
app.all('*', (req, res, next) => {
	res.header('Access-Control-Allow-Origin', req.headers.origin)
	res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Accept, x-token')
	res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
	res.header('Access-Control-Allow-Credentials', true)

	if (req.method == 'OPTIONS') {
		res.sendStatus(200)
	} else {
		next()
	}
})

//上传文件
var createFolder = function(folder) {
	try {
		fs.accessSync(folder)
	} catch (e) {
		fs.mkdirSync(folder)
	}
}

var uploadFolder = './public/uploads'

createFolder(uploadFolder)

// 通过 filename 属性定制
var storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, uploadFolder) // 保存的路径，备注：需要自己创建
	},
	filename: function(req, file, cb) {
		var fileFormat = (file.originalname).split(".")
		cb(null, file.fieldname + '_' + Date.now() + "." + fileFormat[fileFormat.length - 1])
	}
})

// 通过 storage 选项来对 上传行为 进行定制化
var upload = multer({
	storage: storage
})

// 单图上传
app.post('/upload/file', upload.single('file'), function(req, res, next) {
	var token = req.body.token
	if (!sessionFactory.checkSession(token))
		return res.status(404).send('token failure');
	res.json({
		name: req.file.originalname,
		url: 'http://' + req.headers.host + req.file.path.slice(6)
	})
});

app.use('/', indexRouter)

app.get('/message/getAll', (req, res, next) => {
	res.json({
		code: 0,
		data: {
			total: 10,
			merNumber: 1,
			proNumber: 20,
			proSNumber: 300,
			list: []
		}
	})
})

app.use('/user', userRouter)
app.use('/brand', brandRouter)
app.use('/version', versionRouter)
app.use('/commercial', commercialRouter)
app.use('/store', storeRouter)
app.use('/payOrder', payOrderRouter)
app.use('/sellOrder', sellOrderRouter)
app.use('/inStore', inStoreRouter)
app.use('/outStore', outStoreRouter)
app.use('/inventory', inventoryRouter)
app.use('/utils', utilsRouter)


// catch 404 and forward to error handler
app.use((req, res, next) => {
	next(createError(404))
})

// error handler
app.use((err, req, res, next) => {
	// set locals, only providing error in development
	res.locals.message = err.message
	res.locals.error = req.app.get('env') === 'development' ? err : {}

	// render the error page
	res.status(err.status || 500)
	res.render('error')
})

module.exports = app