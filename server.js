var express = require('express')
var app = express()
const bodyParser = require('body-parser');
const path = require('path');
const PORT = 3011;

app.use(express.static(`${__dirname}`))
app.use('/assets', express.static(`${__dirname}/assets/`));
app.use('/lib', express.static(`${__dirname}/lib/`))
 
// app.get('/', function (req, res) {
//   res.sendFile(path.join(__dirname, 'chapter-01/01_02/begin', 'index.html'))
// })
app.get('/l-1', function (req, res) {
  res.sendFile(path.join(__dirname, 'lesson_1', 'index.html'))
})
app.get('/l-1-fc', function (req, res) {
  res.sendFile(path.join(__dirname, 'lesson_1', 'index-fc.html'))
})
app.get('/l-2', function (req, res) {
  res.sendFile(path.join(__dirname, 'lesson_2', 'index.html'))
})
app.get('/l-3', function(req, res) {
	res.sendFile(path.join(__dirname, 'lesson_3', 'index.html'))
})
app.get('/l-3-2', function(req, res) {
	res.sendFile(path.join(__dirname, 'lesson_3/2', 'index.html'))
})
app.get('/l-3-3', function(req, res) {
	res.sendFile(path.join(__dirname, 'lesson_3/3', 'index.html'))
})
app.get('/l-4-1', function(req, res) {
	res.sendFile(path.join(__dirname, 'lesson_4', 'index.html'))
})
app.get('/l-4-2', function(req, res) {
	res.sendFile(path.join(__dirname, 'lesson_4/2', 'index.html'))
})
app.get('/l-5', function(req, res) {
	res.sendFile(path.join(__dirname, 'lesson_5', 'index.html'))
})

app.get('/just-goofin', function(req, res) {
	res.sendFile(path.join(__dirname, 'justGoofin', 'index.html'))
})
app.get('/ecomm-module', function(req, res) {
	res.sendFile(path.join(__dirname, 'ecomm', 'index.html'))
})
app.get('/particle-play', function(req, res) {
	res.sendFile(path.join(__dirname, 'particles', 'index.html'))
})
app.get('/procedural', function(req, res) {
	res.sendFile(path.join(__dirname, 'procedural-terrain', 'index.html'))
})
 
app.listen(PORT, () => console.log(`Listening on Port: ${PORT}`));