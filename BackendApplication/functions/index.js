const functions = require('firebase-functions');
const express = require('express')
const app = express()
const share = require("./ShareFunctions/Share")
app.get('/test', (req, res) => {
    res.send(share.mess);
})
exports.app = functions.https.onRequest(app);
