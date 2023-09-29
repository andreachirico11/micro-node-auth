const express = require('express')
const app = express()
app.all('/', (req, res) => {
    console.log("Just got a request!")
    res.send('Yo!')
})
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log("listening on port: " + port);
})