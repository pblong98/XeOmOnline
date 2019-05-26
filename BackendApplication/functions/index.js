const functions = require('firebase-functions');
const express = require('express')
const app = express()
const share = require("./ShareFunctions/Share")

app.get('/signup/username/:uname/password/:pword', (req, res) => {
    var data = "fail";
    share.SignUp(req.params.uname, req.params.pword).then((result) => {
        data = result;
        res.send(data);
        return;
    }).catch((e)=>{
        data = false;
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

app.get('/DriverReady/OnMissionNotify/token/:token/IsOnMission/:IsOnMission', (req, res) => {
    var token = req.params.token;
    var IsOnMission = req.params.IsOnMission;
    var response = false;
    share.DriverOnMissionNotify(token,IsOnMission).then((result)=>{
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
