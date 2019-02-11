const { createCanvas } = require('canvas')

const hex2rgb = function (hexStr) {
  let match
  hexStr = hexStr.replace(/#/g, '')
  const rsplit = /[\dA-Fa-f]{2}/g
  if (hexStr.length === 3 || hexStr.length === 4) {
    hexStr = hexStr.replace(/([\dA-Fa-f])/g, '$1$1')
  }
  match = hexStr.match(rsplit)
  return {
    r: +('0x' + match[0]).toString(10),
    g: +('0x' + match[1]).toString(10),
    b: +('0x' + match[2]).toString(10)
  }
}

module.exports = function (params) {
  const w = params.width
  const h = params.height

  const fc = hex2rgb(params.foreground || '343f45')
  const bc = hex2rgb(params.background || '998fc3')

  let canvas = createCanvas(w, h)
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = 'rgba( ' + bc.r + ',' + bc.g + ',' + bc.b + ',0.8)'
  ctx.fillRect(0, 0, w, h)

  ctx.fillStyle = 'rgba( ' + fc.r + ',' + fc.g + ',' + fc.b + ', 1)'
  ctx.font = (w / 20) + 'px arial'
  const text = params.text || (w + ' X ' + h)
  const mtext = ctx.measureText(text)
  ctx.fillText(text, w / 2 - mtext.width / 2, h / 2)

  return new Promise((resolve, reject) => {
    canvas.toBuffer((err, buf) => {
      if (err) {
        return reject(err)
      }

      canvas = null
      resolve(buf)
    })
  })
}
