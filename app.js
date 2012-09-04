/**
 * Module dependencies.
 */

var express = require('express');
var app = express();
var Canvas = require('canvas');

// Configuration
app.configure(function() {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
	app.use(errorHandler);
});

app.configure('development', function() {
	app.use(express.errorHandler({
		dumpExceptions: true,
		showStack: true
	}));
});

app.configure('production', function() {
	app.use(express.errorHandler());
});

//500 && 400
// Example 500 page
function errorHandler(err, req, res, next) {
    res.status(500);
	res.render('err500', {
		title: '错误啦',
		msg: '服务器出了点问题'
	});
}

// Example 404 page via simple Connect middleware
app.use(function(req, res) {
	res.render('not400', {
		title: '没有啦',
		msg: '这个。。。。真木有'
	});
});

function checkValue(req, res, next) {
	req.width = parseInt(req.params.width, 10);
	req.height = parseInt(req.params.height, 10);

	if (isNaN(req.width) || isNaN(req.height)) {
		res.render('err500', {
			title: '错误啦',
			msg: '参数不合法'
		});
	} else {
		next();
	}
}

function random(max, min) {
	return Math.floor(Math.random() * (max - min) + min)
}

function getImageBody(req, res, next) {
	var w = req.width,
	h = req.height,
	canvas = new Canvas(w, h),
	ctx = canvas.getContext('2d'),
	r = random(255, 0),
	sr = 255 - r,
	g = random(255, 0),
	sg = 255 - g,
	b = random(255, 0),
	sb = 255 - b;

	ctx.fillStyle = 'rgba( ' + r + ',' + g + ',' + b + ',0.8)';
	ctx.fillRect(0, 0, w, h);

	ctx.fillStyle = 'rgba( ' + sr + ',' + sg + ',' + sb + ', 1)';
	ctx.font = '12px arial';
	ctx.fillText(w + "X" + h, w / 2, h / 2);

	canvas.toBuffer(function(err, buf) {
		if (err) throw err;
		req.bufImage = buf;

		canvas = null;
		next();
	});
}

// Routes
app.get('/', function(req, res) {
	res.render('index', {
		title: 'hulder...',
		des: ['使用说明', '1.绑定一个host', '   10.2.17.30 holder', '2.需要图片的地方使用', '   http://holder/宽/高', '意见建议邮件 dev.hubo@gmail.com'].join('\n')
	});
});

app.get('/:width/:height', checkValue, getImageBody, function(req, res) {
    res.type('png');
	res.send(req.bufImage);
    req = null;
});

if (!module.parent) {
	app.listen(3000);
}
