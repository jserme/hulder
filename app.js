// Generated by CoffeeScript 1.3.3
(function() {
  var Canvas, app, errorHandler, express, getAndCheck, getImageBody, hex2rgb;

  express = require('express');

  app = express();

  Canvas = require('canvas');

  errorHandler = function(err, req, res, next) {
    res.status(500);
    return res.render('err500', {
      title: '错误啦',
      msg: '服务器出了点问题'
    });
  };

  app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express["static"](__dirname + '/public'));
    return app.use(errorHandler);
  });

  app.use(function(req, res) {
    return res.render('not400', {
      title: '没有啦',
      msg: '这个。。。。真木有'
    });
  });

  getAndCheck = function(req, res, next) {
    var canvasParams, color, ocolor, owh, text, wh;
    wh = req.params.wh;
    color = req.params.color;
    text = req.params.text;
    canvasParams = {};
    if (wh && wh.trim()) {
      owh = wh.toLowerCase().split('x');
      canvasParams.width = +owh[0];
      canvasParams.height = +owh[1];
    }
    if (color && color.trim()) {
      ocolor = color.toLowerCase().split('x');
      canvasParams.foreground = ocolor[0];
      canvasParams.background = ocolor[1];
    }
    if (text && text.trim()) {
      canvasParams.text = text;
    }
    if (isNaN(+canvasParams.width) || isNaN(+canvasParams.height)) {
      return res.render('err500', {
        title: '错误啦',
        msg: '参数不合法'
      });
    } else {
      req.canvasParams = canvasParams;
      return next();
    }
  };

  hex2rgb = function(hexStr) {
    var match, rsplit;
    hexStr = hexStr.replace(/#/g, '');
    rsplit = /[\dA-Fa-f]{2}/g;
    if (hexStr.length === 3 || hexStr.length === 4) {
      hexStr = hexStr.replace(/([\dA-Fa-f])/g, "$1$1");
    }
    match = hexStr.match(rsplit);
    return {
      r: +('0x' + match[0]).toString(10),
      g: +('0x' + match[1]).toString(10),
      b: +('0x' + match[2]).toString(10)
    };
  };

  getImageBody = function(req, res, next) {
    var bc, canvas, ctx, fc, h, p, w;
    p = req.canvasParams;
    w = p.width;
    h = p.height;
    fc = hex2rgb(p.foreground || '343f45');
    bc = hex2rgb(p.background || '998fc3');
    Canvas = require('canvas');
    canvas = new Canvas(w, h);
    ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba( ' + bc.r + ',' + bc.g + ',' + bc.b + ',0.8)';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'rgba( ' + fc.r + ',' + fc.g + ',' + fc.b + ', 1)';
    ctx.font = (w / 20) + 'px arial';
    ctx.fillText(p.text || (w + " X " + h), w / 2, h / 2);
    return canvas.toBuffer(function(err, buf) {
      if (err) {
        throw err;
      }
      req.bufImage = buf;
      canvas = null;
      return next();
    });
  };

  app.get('/', function(req, res) {
    return res.render('index', {
      title: 'hulder...'
    });
  });

  app.get('/:wh/:color?/:text?', getAndCheck, getImageBody, function(req, res) {
    res.type('png');
    res.send(req.bufImage);
    return req = null;
  });



  app.listen(8325);

}).call(this);
