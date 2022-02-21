require('dotenv').config();
const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT;

const app = express()

//routes
app.use('/api', require('./routes'))


//enable cors
app.use(cors())

//start
app.listen(PORT, () => console.log(`server running on port ${PORT}`))