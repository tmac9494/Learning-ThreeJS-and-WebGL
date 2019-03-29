var express = require('express')
var app = express()
const bodyParser = require('body-parser');
const path = require('path');

app.use(express.static(`${__dirname}`))
app.use('/assets', express.static(`${__dirname}/assets/`));
app.use('/lib', express.static(`${__dirname}/lib/`))
 
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'chapter-01/01_02/begin', 'index.html'))
})
 
app.listen(3010);