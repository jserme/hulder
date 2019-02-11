
module.exports = function (req, res, next) {
  const wh = req.params.wh
  const color = req.params.color
  const text = req.params.text
  const canvasParams = {}
  let owh
  let ocolor

  if (wh && wh.trim()) {
    owh = wh.toLowerCase().split('x')
    canvasParams.width = +owh[0]
    canvasParams.height = +owh[1]
  }

  if (color && color.trim()) {
    ocolor = color.toLowerCase().split('x')
    canvasParams.foreground = ocolor[0]
    canvasParams.background = ocolor[1]
  }

  if (text && text.trim()) {
    canvasParams.text = text
  }

  if (isNaN(+canvasParams.width) || isNaN(+canvasParams.height)) {
    return res.render('err500', {
      title: '错误啦',
      msg: '参数不合法'
    })
  } else {
    req.canvasParams = canvasParams
    return next()
  }
}
