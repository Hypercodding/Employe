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
app.use('/api/employee', require('./routes/emp'))

app.use('/api/loan', require('./routes/loan'))

app.use('/api/leave', require('./routes/leave'))
app.use('/api/account', require('./routes/account'))

app.use('/api/salary', require('./routes/salary'))
app.use('/api/purchase', require('./routes/purchase'))
app.use('/api/company', require('./routes/cmp'))//company
// app.use('/api/items', require('./routes/items'))//company
// app.use('/api/product', require('./routes/product'))//product
// app.use('/api/salary', require('./routes/salary'))//product

  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
