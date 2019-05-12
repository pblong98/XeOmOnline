const express = require('express')
const app = express()
const port = 3000
const share = require("./ShareFunctions/Share")

app.get('/test', (req, res) => {
    res.send(share.mess);
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
