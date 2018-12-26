const chalk = require('chalk')
const express = require('express')
const app = express()
const port = 8176

app.use(function(req, res, next) {
  console.log(chalk.yellowBright('Incoming request: ') + req.url)
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})
app.use(express.json())        // to support JSON-encoded bodies
// app.use(express.urlencoded())  // to support URL-encoded bodies

/*
**** DELETE
*/
const chat_DELETE = require('./DELETE/chat.js')
app.post('/chat', async function (req, res, next) {
  try { res.json(await chat_DELETE.request(Object.assign(req.params, req.query))) }
  catch (e) { next(e) }
})

/*
**** GET
*/
const account_GET = require('./GET/account.js')
app.get('/account', async function (req, res, next) {
  try { res.json(await account_GET.request(Object.assign(req.params, req.query))) }
  catch (e) { next(e) }
})
const chat_GET = require('./GET/chat.js')
app.get('/chat', async function (req, res, next) {
  try { res.json(await chat_GET.request(Object.assign(req.params, req.query))) }
  catch (e) { next(e) }
})
const messages_GET = require('./GET/messages.js')
app.get('/messages', async function (req, res, next) {
  try { res.json(await messages_GET.request(Object.assign(req.params, req.query))) }
  catch (e) { next(e) }
})
const people_GET = require('./GET/people.js')
app.get('/people', async function (req, res, next) {
  try { res.json(await people_GET.request(Object.assign(req.params, req.query))) }
  catch (e) { next(e) }
})
const profile_GET = require('./GET/profile.js')
app.get('/profile', async function (req, res, next) {
  try { res.json(await profile_GET.request(Object.assign(req.params, req.query))) }
  catch (e) { next(e) }
})
const auth_GET = require('./GET/auth.js')
app.get('/auth', async function (req, res, next) {
  try { res.json(await auth_GET.request(Object.assign(req.params, req.query))) }
  catch (e) { next(e) }
})
const settings_GET = require('./GET/settings.js')
app.get('/settings', async function (req, res, next) {
  try { res.json(await settings_GET.request(Object.assign(req.params, req.query))) }
  catch (e) { next(e) }
})

/*
**** POST
*/
const chat_POST = require('./POST/chat.js')
app.post('/chat', async function (req, res, next) {
  try { res.json(await chat_POST.request(Object.assign(req.params, req.query))) }
  catch (e) { next(e) }
})

/*
**** PUT
*/
const push_PUT = require('./PUT/push.js')
app.put('/push', async function (req, res, next) {
  try { res.json(await push_PUT.request(Object.assign(req.params, req.query))) }
  catch (e) { next(e) }
})
const auth_PUT = require('./PUT/auth.js')
app.put('/auth', async function (req, res, next) {
  try { res.json(await auth_PUT.request(Object.assign(req.params, req.query, req.body))) }
  catch (e) { next(e) }
})
app.put('/auth/:code', async function (req, res, next) {
  try { res.json(await auth_PUT.request(Object.assign(req.params, req.query, req.body))) }
  catch (e) { next(e) }
})
const settings_PUT = require('./PUT/settings.js')
app.put('/settings', async function (req, res, next) {
  try { res.json(await settings_PUT.request(Object.assign(req.params, req.query))) }
  catch (e) { next(e) }
})

app.listen(port)
console.log(`Listening on port: ${port}`)
