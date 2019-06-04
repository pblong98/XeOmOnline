const ServiceAccount = require("../xeomonlinebackend-firebase-adminsdk-03zi2-78fb8dab8e.json");
const admin = require('firebase-admin');
var crypto = require("crypto");
var MoongoDB = require("../MoongoDB");

admin.initializeApp({
    credential: admin.credential.cert(ServiceAccount),
    databaseURL: "https://xeomonlinebackend.firebaseio.com"
});

// Get a reference to the database service
var database = admin.database();

function delay(ms) {
    return new Promise(function (resolve, reject) {
        setTimeout(resolve, ms);
    });
}

async function SignUp(username, password, name, phone, lisense) {   
    var response = "fail"; 
    await CheckSigupInfo(username).then((data)=>{
        if(data === true)
        {
            database.ref("DriverAccount/").child(username).child("Password").set(password);
            database.ref("DriverAccount/").child(username).child("Name").set(name);
            database.ref("DriverAccount/").child(username).child("Phone").set(phone);
            database.ref("DriverAccount/").child(username).child("LisensePlate").set(lisense);
            database.ref("DriverAccount/").child(username).child("Avatar").set("https://miro.medium.com/max/2400/1*0Q88dFoE3cvnQeV3RY-gSA.jpeg");
            database.ref("AccessToken/").child(username).set(crypto.randomBytes(20).toString('hex'));
            response = username;
            MoongoDB.SaveDriverAccount(username, password, name, phone, lisense);
        }
        return;
    });
    return response;
}

async function SignIn(username, password) {   
    var response = {status: "fail", token:""}; 
    await CheckSiginInfo(username, password).then((data)=>{
        {
            //console.log(data);
            response = data;
        }      
        return;
    });
    return response;
}

async function CheckSigupInfo(username)
{
    var isOK = true;
    await database.ref("DriverAccount").child(username).once('value').then((data) => {
        if(data.val() === null)
        {
            isOK = true;
        }
        else 
        {
            isOK = false;
        }
        return isOK;
    });
    return isOK;
}

async function CheckSiginInfo(username, password)
{
    var response = {status: "fail", token:""}; 
    var isOk = false;

    await database.ref("DriverAccount").child(username).once('value').then((data) => {
        
        if(data.val().Password === password)
        {
            isOk = true;
        }
        return;
    });
    
    if(isOk)
    {
        await database.ref("AccessToken").child(username).once('value').then((data) => {
            //console.log(username + "||" + data.key);
            if(data.val() !== null)
            {
                response.status = "ok";
                response.token = data.val();
            }
            else 
            {
                response.token = "";
            }
            return;
        });
    }
    //console.log(response);
    return response;
}

async function GetUserFromToken(token)
{
    var UserName = "";
    var querydata = "";
    await database.ref('AccessToken').orderByValue().equalTo(token).limitToFirst(1).once("value", function(snapshot) {
        querydata = snapshot;
    });

    await querydata.forEach(function(data) {
        UserName = data.key;
    });
    return UserName;
}

async function GetDriverInfor(driver)
{
    var data = {Avatar:"", LisensePlate:"", Name:"", Phone:""};
    await database.ref('DriverAccount').child(driver).once("value").then(_data => {
        data.Avatar = _data.val().Avatar;
        data.LisensePlate = _data.val().LisensePlate;
        data.Name = _data.val().Name;
        data.Phone = _data.val().Phone;
        return;
    });
    return data;
}

async function DriverInitPosition(token, lat, lng) {   
    var status = false;
    var DriverUserName; 
    await GetUserFromToken(token).then((user)=>{
        DriverUserName = user;
        return;
    });
    //console.log(DriverUserName);
    if(DriverUserName !== "")
    {
        await database.ref("DriverReady/"+DriverUserName).child('lat').set(Number(lat));
        await database.ref("DriverReady/"+DriverUserName).child('lng').set(Number(lng));
        await database.ref("DriverReady/"+DriverUserName).child('Notification').set("");
        status = true;
    }
    return status;
}

async function DriverUpdatePosition(token, lat, lng)
{
    var status = false;
    var DriverUserName; 
    await GetUserFromToken(token).then((user)=>{
        DriverUserName = user;
        return;
    });
    //console.log(DriverUserName);
    var isInMission = false;
    await CheckIfDriverOnMission(DriverUserName).then(data=>{
        isInMission = data;
        return;
    });
    //console.log(isInMission);
    if(DriverUserName !== "" && isInMission)
    {
        await database.ref("DriverReady/"+DriverUserName).child('Notification').once("value").then(data =>{
            //console.log(lat+ "           "+ lng)
            database.ref("DriverReady/"+DriverUserName).child('lat').set(Number(lat));
            database.ref("DriverReady/"+DriverUserName).child('lng').set(Number(lng));
            database.ref("DriverReady/"+DriverUserName).child('Notification').set(data.val());
            return;
        })
        status = true;
    }
    return status;
}

async function DriverUnready(token) {   
    var status = false;
    var DriverUserName; 
    await GetUserFromToken(token).then((user)=>{
        DriverUserName = user;
        return;
    });
    //console.log(DriverUserName);
    if(DriverUserName !== "")
    {
        await database.ref("DriverReady/").child(DriverUserName).remove();
        status = true;
    }
    return status;
}

async function CheckIfDriverOnMission(driver)
{
    var isOk = false;
    await database.ref('DriverReady/'+driver).once('value').then((data)=>{
        if(data.val() !== null)
        {
            isOk = true;
        }
        return;
    }).catch((e)=>{
        isOk = false;
    });
    return isOk;
}

async function GetAllDriverPosition()
{
    var data;
    await database.ref("DriverReady").once("value").then(_data => {
        data = _data.exportVal();
        //console.log(data.length);
        return;
    });
    return data;
}

function CreatePassengerRequest(s_lat, s_lng, d_lat, d_lng)
{
    var Distance = GetDistanceFromLatLonInKm(s_lat, s_lng, d_lat, d_lng);
    var keyRequest = database.ref("PassengerRequest").push({start:{lat:s_lat ,lng:s_lng}, dest:{lat:d_lat ,lng:d_lng}, Distance:Distance, Price: Distance*5000, Driver: "null", DriverStatus: 0, DriverFinishConfirm: 0, PassengerFinishConfirm: 0}).key;
    FindDriverForPassenger(keyRequest,0);
    return keyRequest;
}

async function GetPassengerRequestResponse(RequestId)
{
    var data;
    await database.ref("PassengerRequest").child(RequestId).once("value").then(_data => {
        data =_data.val();    
        return;
    });
    //console.log(data);
    return data;
}

async function PassengerDestroyRequest(RequestId)
{
    await database.ref("PassengerRequest").child(RequestId).once("value").then(data => {
        //console.log(data.val());
        database.ref("DriverReady").child(data.val().Driver).remove();
        database.ref("PassengerRequest").child(RequestId).remove();
        return
    });
    
    return "ok";
}

async function DriverDeniePassengerRequest(token, RequestId)
{
    var status = false;
    var DriverUserName; 
    await GetUserFromToken(token).then((user)=>{
        DriverUserName = user;
        return;
    });
    await database.ref('PassengerRequest').child(RequestId).once("value").then(data =>{
        if(DriverUserName === data.val().Driver)
        {
            database.ref('PassengerRequest').child(RequestId).child("Driver").set("null");
        }
        status = true;
        database.ref("PassengerRequest").child(RequestId).remove();
        return;
    }).catch(e=>{
        status = false;
    });
    return status;
}

async function FindDriverForPassenger(RequestId, time)
{
    //console.log(time);
    var StarPos;
    await database.ref("PassengerRequest").child(RequestId).once("value").then(_data => {
        
        var data = _data.val();
        if(data !== null)
        {
            StarPos = {lat: data.start.lat, lng: data.start.lng};
        }
        else
        {
            StarPos = null;
        }
        return;
    });

    var TempDriver = null, MinDistance = 999999;

    if(StarPos !== null)
    {      
        await database.ref("DriverReady").once("value").then(_data=>{
            var data = _data.val();
            if(data !== null)
            {
                //console.log(data);
                var list = Object.getOwnPropertyNames(data);
                //console.log("current driver" + list);  
                for(var i = 0; i < list.length ; i++)
                {
                    var CurrentLat = data[list[i]].lat;
                    //console.log("current driver" + list[i]);        
                    var CurrentLng = data[list[i]].lng;
                    var TempDistance = GetDistanceFromLatLonInKm(StarPos.lat, StarPos.lng, CurrentLat, CurrentLng);
                    //console.log(list[i] + "    temp: " + TempDistance + "   " + MinDistance);
                    if(TempDistance < MinDistance && data[list[i]].Notification === "")
                    {
                        //console.log(data[list[i]].Notification);
                        TempDriver = list[i];
                        MinDistance = TempDistance;
                    }
                    //console.log();
                }
            }
            return;
        });
        if(TempDriver !== null)
        {
            database.ref("PassengerRequest").child(RequestId).child('Driver').set(TempDriver);
            database.ref("DriverReady").child(TempDriver).child('Notification').set(RequestId);  
        }
        else
        {
            //console.log("lap trong");
            await delay(1000).then(()=>{
                FindDriverForPassenger(RequestId, time++);
                return;
            });
        }
        
    }
    else
    {
        //console.log("lap ngoai");
        await delay(1000).then(()=>{
            FindDriverForPassenger(RequestId, time++);
            return;
        });
    }
}

function GetDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = Deg2rad(lat2-lat1);  // deg2rad below
    var dLon = Deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(Deg2rad(lat1)) * Math.cos(Deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
}
  
function Deg2rad(deg) {
return deg * (Math.PI/180)
}

async function DriverListeningToNotification(token)
{
    var DriverUserName; 
    await GetUserFromToken(token).then((user)=>{
        DriverUserName = user;
        return;
    });
    var Notification;
    await database.ref('DriverReady').child(DriverUserName).child('Notification').once("value").then(data => {
        Notification = data.val();
        return;
    });
    return Notification;
}

async function DriverGetPassengerRequestInfor(token, requestId)
{
    var DriverUserName =null; 
    await GetUserFromToken(token).then((user)=>{
        DriverUserName = user;
        return;
    });

    var data = "";
    if(DriverUserName !== null)
    {
        await database.ref('PassengerRequest/'+requestId).once('value').then(_data => {
            data = _data.val();
            return;
        });
    }
    return data;
}

async function DriverAppceptRequestInfor(token, requestId)
{
    var DriverUserName =null; 
    await GetUserFromToken(token).then((user)=>{
        DriverUserName = user;
        return;
    });

    var data = "";
    if(DriverUserName !== null)
    {
        database.ref('PassengerRequest/'+requestId).child("DriverStatus").set(1);
        data = "ok";
    }
    return data;
}

async function MissionFinishDriverConfirm(token, RequestId)
{
    var DriverUserName =null; 
    await GetUserFromToken(token).then((user)=>{
        DriverUserName = user;
        return;
    });
    if(DriverUserName !== null)
        database.ref('PassengerRequest/'+RequestId).child("DriverFinishConfirm").set(1);
    return "ok";
}

async function MissionFinishPassengerConfirm(RequestId)
{
    //console.log("aaaaaaaa " + RequestId);
    await database.ref('PassengerRequest/'+RequestId).child("PassengerFinishConfirm").set(1);
    SaveMissionHistory(RequestId);
    return "ok";
}

function SaveMissionHistory(RequestId)
{
    database.ref('PassengerRequest/'+RequestId).once("value").then(_data =>{
        var data = _data.val();
        //console.log(data);
        if(data !== null)
        {
            if(data.DriverFinishConfirm === 1 && data.PassengerFinishConfirm === 1)
            {
                database.ref('DriverAccount/'+data.Driver).child("History").child(RequestId).set(data);
                database.ref('DriverReady/'+data.Driver).remove();
                database.ref('PassengerRequest/'+RequestId).remove();
                
            }
            else
            {
                delay(1000).then(()=>{
                    SaveMissionHistory(RequestId);
                    return;
                }).catch();
            }
        }
        return;
    }).catch(e=>{});
}

async function ShowHistory(token)
{
    var DriverUserName =null; 
    var returnData = null;
    await GetUserFromToken(token).then((user)=>{
        DriverUserName = user;
        return;
    });

    if(DriverUserName !== null)
    {
        await database.ref('DriverAccount').child(DriverUserName).child('History').once('value').then(data =>{
            returnData = data.val();
            return;
        });
    }
    return returnData;
}

async function GetSingleDriverLocation(driver)
{
    var data = null;
    await database.ref("DriverReady").child(driver).once("value").then(_data=>{
        data = _data;
        return;
    });
    return data;
}




module.exports.SignUp = SignUp;
module.exports.SignIn = SignIn;
module.exports.DriverInitPosition = DriverInitPosition;
module.exports.DriverUpdatePosition = DriverUpdatePosition;
module.exports.GetAllDriverPosition = GetAllDriverPosition;
module.exports.DriverUnready = DriverUnready;
module.exports.CreatePassengerRequest = CreatePassengerRequest;
module.exports.GetPassengerRequestResponse = GetPassengerRequestResponse;
module.exports.PassengerDestroyRequest = PassengerDestroyRequest;
module.exports.DriverListeningToNotification = DriverListeningToNotification;
module.exports.DriverGetPassengerRequestInfor = DriverGetPassengerRequestInfor;
module.exports.DriverAppceptRequestInfor = DriverAppceptRequestInfor;
module.exports.MissionFinishDriverConfirm = MissionFinishDriverConfirm;
module.exports.MissionFinishPassengerConfirm = MissionFinishPassengerConfirm;
module.exports.GetDriverInfor = GetDriverInfor;
module.exports.DriverDeniePassengerRequest = DriverDeniePassengerRequest;
module.exports.ShowHistory = ShowHistory;
module.exports.GetSingleDriverLocation = GetSingleDriverLocation;





