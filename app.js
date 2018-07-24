const express =require('express');
const bodyParser = require('body-parser');
const port = 3000;
const app = express();
const routes = require('./routes')

app.use(bodyParser.urlencoded({extended : false}))
app.use(bodyParser.json())

app.use('/',routes)

app.listen(port,() => {
  console.log(`Express Server is Running in ${port}`);
})
