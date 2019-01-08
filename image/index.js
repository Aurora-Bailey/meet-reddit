const jimp = require('jimp')
const jwt = require('jsonwebtoken')
const express = require('express')
const credentials = require('./credentials.json')
const app = express()
const port = process.env.PORT || 8489

app.get('/i/:jwt', async function (req, res, next) {
  try {
    let params = req.params
    let token = params.jwt.replace(/\.jpg$/, '')
    let data = jwt.verify(token, credentials.secret)
    let softImage = await jimp.read(data.url)
    if (data.crop) {
      var bufferImage = await softImage
      .cover(data.x, data.y) // resize
      .quality(75) // set JPEG quality
      .getBufferAsync(jimp.MIME_JPEG)
    } else {
      var bufferImage = await softImage
      .scaleToFit(data.x, data.y) // resize
      .quality(75) // set JPEG quality
      .getBufferAsync(jimp.MIME_JPEG)
    }
    res.set('Content-Type', 'image/jpeg')
    res.send(bufferImage)
    console.log(`${Date.now()} ${data.url}`)
    console.log('')
  } catch (e) {
    console.log(e)
    res.status(400).send('Bad Request')
  }

})

app.get('*', async function (req, res, next) {
  res.status(404).send('Page not found!')
})

app.listen(port)
console.log(`Listening on port: ${port}`)
