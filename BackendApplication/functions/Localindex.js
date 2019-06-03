const express = require('express');
const app = express();
const port = 3000;
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
    var response = {status: "fail", mess:""};
    share.SignUp(req.params.uname, req.params.pword, req.params.name, req.params.phone, req.params.lisense).then((result) => {
        response.mess = result;
        response.status = "ok";
        res.send(response);
        console.log("New user: " + data);
        return;
    }).catch((e)=>{
        response.mess = "";
        response.status = "fail";
        res.send(response);
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

app.get('/GetDriverInfor/:driver', (req, res) => {
    share.GetDriverInfor(req.params.driver).then((result) => {
        res.send({data: result});
        return;
    }).catch((e)=>{
        res.send({data: null});
        return;
    });
});

app.get('/DriverInitPosition/token/:token/lat/:lat/lng/:lng', (req, res) => {
    var token = req.params.token;
    var lat = req.params.lat;
    var lng = req.params.lng;
    var response = false;
    //console.log(token + " " + lat + " " + lng);
    share.DriverInitPosition(token,lat,lng).then((result)=>{
        response = result;
        res.send(response);
        return;
    }).catch((e)=>{
        response = false;
        res.send(response);
        return;
    });
});

app.get('/DriverUpdatePosition/token/:token/lat/:lat/lng/:lng', (req, res) => {
    var token = req.params.token;
    var lat = req.params.lat;
    var lng = req.params.lng;
    var response = false;
    //console.log("asdfsadfsadf  " + token + " " + lat + " " + lng);
    share.DriverUpdatePosition(token,lat,lng).then((result)=>{
        response = result;
        res.send(response);
        return;
    }).catch((e)=>{
        response = false;
        res.send(response);
        return;
    });
});

app.get('/GetAllDriverPos', (req, res) => {
    var response = "";
    share.GetAllDriverPosition().then((result)=>{
        response = result;
        res.send(response);
        return;
    }).catch((e)=>{
        response = false;
        res.send(response);
        return;
    });
});

app.get('/DriverUnready/:token', (req, res) => {
    var response = "";
    var token = req.params.token;
    share.DriverUnready(token).then((result)=>{
        response = result;
        res.send(response);
        return;
    }).catch((e)=>{
        response = false;
        res.send(response);
        return;
    });
});

app.get('/PassengerNewRequest/:s_lat/:s_lng/:d_lat/:d_lng', (req, res) => {
    var s_lat = req.params.s_lat;
    var s_lng = req.params.s_lng;
    var d_lat = req.params.d_lat;
    var d_lng = req.params.d_lng;
    res.send({RequestKey: share.CreatePassengerRequest(s_lat,s_lng,d_lat,d_lng)});
});

app.get('/PassengerGetRequest/:RequestId', (req, res) => {
    var RequestId = req.params.RequestId;
    share.GetPassengerRequestResponse(RequestId).then(data =>{
        //console.log(data);
        res.send(data);
        return;
    }).catch(e => {
        res.send(null);
        return;
    });
});

app.get('/PassengerDestroyRequest/:RequestId', (req, res) => {
    var RequestId = req.params.RequestId;
    share.PassengerDestroyRequest(RequestId).then(data =>{
        //console.log(data);
        res.send({data:data});
        return;
    }).catch(e => {
        res.send(null);
        return;
    });
});

app.get('/DriverListeningToNotification/:token', (req, res) => {
    var token = req.params.token;
    share.DriverListeningToNotification(token).then(data =>{
        //console.log(data);
        res.send({data:data});
        return;
    }).catch(e => {
        res.send(null);
        return;
    });
});

app.get('/DriverGetPassengerRequestInfor/:token/:requestId', (req, res) => {
    var token = req.params.token;
    var requestId = req.params.requestId;
    share.DriverGetPassengerRequestInfor(token,requestId).then(data =>{
        //console.log(data);
        res.send({data:data});
        return;
    }).catch(e => {
        res.send(null);
        return;
    });
});

app.get('/DriverAppceptRequestInfor/:token/:requestId', (req, res) => {
    var token = req.params.token;
    var requestId = req.params.requestId;
    share.DriverAppceptRequestInfor(token,requestId).then(data =>{
        //console.log(data);
        res.send({data:data});
        return;
    }).catch(e => {
        res.send(null);
        return;
    });
});

app.get('/DriverDeniePassengerRequest/:token/:requestId', (req, res) => {
    var token = req.params.token;
    var requestId = req.params.requestId;
    share.DriverDeniePassengerRequest(token,requestId).then(data =>{
        //console.log(data);
        res.send({data:data});
        return;
    }).catch(e => {
        res.send(null);
        return;
    });
});


app.get('/MissionFinishDriverConfirm/:token/:requestId', (req, res) => {
    var token = req.params.token;
    var requestId = req.params.requestId;
    share.MissionFinishDriverConfirm(token,requestId).then(data =>{
        //console.log(data);
        res.send({data:data});
        return;
    }).catch(e => {
        res.send(null);
        return;
    });
});

app.get('/MissionFinishPassengerConfirm/:requestId', (req, res) => {
    var requestId = req.params.requestId;
    share.MissionFinishPassengerConfirm(requestId).then(data =>{
        //console.log(data);
        res.send({data:data});
        return;
    }).catch(e => {
        res.send(null);
        return;
    });
});

app.get('/ShowHistory/:token', (req, res) => {
    var token = req.params.token;
    share.ShowHistory(token).then(data =>{
        //console.log(data);
        res.send({data:data});
        return;
    }).catch(e => {
        res.send(null);
        return;
    });
});

app.get('/GetSingleDriverLocation/:driver', (req, res) => {
    var driver = req.params.driver;
    share.GetSingleDriverLocation(driver).then(data =>{
        //console.log(data);
        res.send({data:data});
        return;
    }).catch(e => {
        res.send(null);
        return;
    });
});






app.listen(port, () => console.log(`Example app listening on port ${port}!`))
