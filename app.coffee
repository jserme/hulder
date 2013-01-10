express = require 'express'
http = require 'http'
app = express()
Canvas = require 'canvas'
port = 8325

#Configuration
app.configure ->
    app.set 'views', __dirname + '/views'
    app.set 'view engine', 'jade'
    app.use express.bodyParser()
    app.use express.methodOverride()
    app.use app.router
    app.use express.static __dirname + '/public'
    app.use express.logger 'dev'

getAndCheck = (req, res, next)->
    wh = req.params.wh
    color = req.params.color
    text = req.params.text
    
    #console.log( wh, color, text);
    canvasParams = {};
    
    if wh and wh.trim() 
    	owh = wh.toLowerCase().split('x');
    	canvasParams.width = + owh[0];
    	canvasParams.height = + owh[1];
    
    if color and color.trim() 
    	ocolor = color.toLowerCase().split('x');
    	canvasParams.foreground = ocolor[0];
    	canvasParams.background = ocolor[1];
    
    if text and text.trim() 
    	canvasParams.text = text;
    
    #console.log(canvasParams);
    if isNaN( + canvasParams.width) or isNaN( + canvasParams.height)
    	res.render 'err500', 
    		title: '错误啦',
    		msg: '参数不合法'
    else 
    	req.canvasParams = canvasParams;
    	next();

hex2rgb = (hexStr)->
	hexStr = hexStr.replace /#/g, ''
	rsplit = /[\dA-Fa-f]{2}/g

	if hexStr.length == 3 or hexStr.length == 4 
		hexStr = hexStr.replace /([\dA-Fa-f])/g, "$1$1"

	match = hexStr.match rsplit

	r: + ('0x' + match[0]).toString(10),
	g: + ('0x' + match[1]).toString(10),
	b: + ('0x' + match[2]).toString(10)


getImageBody = (req, res, next)-> 
	p = req.canvasParams
	w = p.width
	h = p.height
	fc = hex2rgb p.foreground or '343f45'
	bc = hex2rgb p.background or '998fc3'

	Canvas = require 'canvas'
	canvas = new Canvas w,h
	ctx = canvas.getContext '2d'

	ctx.fillStyle = 'rgba( ' + bc.r + ',' + bc.g + ',' + bc.b + ',0.8)'
	ctx.fillRect 0, 0, w, h

	ctx.fillStyle = 'rgba( ' + fc.r + ',' + fc.g + ',' + fc.b + ', 1)'
	ctx.font = (w / 20) + 'px arial'
	ctx.fillText p.text or (w + " X " + h), w / 2, h / 2

	canvas.toBuffer (err, buf)->
        if err 
            throw err
        req.bufImage = buf
        canvas = null
        next()


#Routes
app.get '/', (req, res)-> 
	res.render 'index', 
		title: 'hulder...'


app.get '/:wh/:color?/:text?', getAndCheck, getImageBody, (req, res) -> 
	res.type 'png'
	res.send req.bufImage
	req = null;

app.get '*', (req, res)-> 
	res.status 500
	res.render 'err500', 
		title: '错误啦'
		msg: '服务器出了点问题'

httpServer = http.createServer app 
httpServer.listen port, ()->
	console.log("Express server listening on port %d in %s mode", port, app.get('env'));
