const functions = require('firebase-functions');
const express = require('express');
const app = express();
const share = require("./ShareFunctions/Share");
var cors = require('cors');
var allowedOrigins = ['http://localhost:4200',
                      'https://xeomonline-a57d4.firebaseapp.com',
                      'https://xeomonline-a57d4.web.app/'];
app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.get('/signup/username/:uname/password/:pword/name/:name/phone/:phone/lisense/:lisense', (req, res) => {
    var data = "fail";
    share.SignUp(req.params.uname, req.params.pword, req.params.name, req.params.phone, req.params.lisense).then((result) => {
        data = result;
        res.send(data);
        console.log("New user: " + data);
        return;
    }).catch((e)=>{
        data = "fail";
        res.send(data);
        return;
    });
});

app.get('/signin/username/:uname/password/:pword', (req, res) => {
    var response = {status: "fail", token:""};
    share.SignIn(req.params.uname, req.params.pword).then((result) => {
        //console.log(result);
        response.status = result.status;
        response.token = result.token;
        res.send(response);
        return;
    }).catch((e)=>{
        res.send({status: "fail", token:""});
        return;
    });
});

app.get('/DriverReady/token/:token/lat/:lat/lng/:lng', (req, res) => {
    var token = req.params.token;
    var lat = req.params.lat;
    var lng = req.params.lng;
    var response = false;
    share.DriverUploadPosition(token,lat,lng).then((result)=>{
        response = result;
        res.send(response);
        return;
    }).catch((e)=>{
        response = false;
        res.send(response);
        return;
    });
});






exports.app = functions.https.onRequest(app);
