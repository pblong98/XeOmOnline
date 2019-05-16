const express = require('express')
const app = express()
const port = 3000
const share = require("./ShareFunctions/Share")

app.get('/testa', (req, res) => {
    res.send(share.mess);
})

app.get('/signup/username/:uname/password/:pword', (req, res) => {
    //res.send(req.params.uname);
    share.SignUp(req.params.uname, req.params.pword).then(function(result){
        console.log(result);
        res.send(result);
    })
    
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
