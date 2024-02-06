const cors = require('cors');

const connectToMongo = require('./db')
connectToMongo();


const express = require('express')
const app = express()
const port = 3500


app.use(cors());


app.use(express.json())
//ROUTES
app.use('/api/auth', require('./routes/auth'))
app.use('/api/emp', require('./routes/emp'))
app.use('/api/cmp', require('./routes/cmp'))//company
app.use('/api/items', require('./routes/items'))//company
app.use('/api/product', require('./routes/product'))//product

  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
