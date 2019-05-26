const ServiceAccount = require("../xeomonlinebackend-firebase-adminsdk-03zi2-78fb8dab8e.json");
const admin = require('firebase-admin');
var crypto = require("crypto");
admin.initializeApp({
    credential: admin.credential.cert(ServiceAccount),
    databaseURL: "https://xeomonlinebackend.firebaseio.com"
});

// Get a reference to the database service
var database = admin.database();

async function SignUp(username, password, name, phone, lisense) {   
    var response = "fail"; 
    await CheckSigupInfo(username).then((data)=>{
        if(data === true)
        {
            database.ref("DriverAccount/").child(username).child("Password").set(password);
            database.ref("DriverAccount/").child(username).child("Name").set(name);
            database.ref("DriverAccount/").child(username).child("Phone").set(phone);
            database.ref("DriverAccount/").child(username).child("LisensePlate").set(lisense);
            database.ref("AccessToken/").child(username).set(crypto.randomBytes(20).toString('hex'));
            response = username;
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

async function DriverUploadPosition(token, lat, lng) {   
    var status = false;
    var DriverUserName; 
    await GetUserFromToken(token).then((user)=>{
        DriverUserName = user;
        return;
    });
    //console.log(DriverUserName);
    if(DriverUserName !== "")
    {
        await database.ref("DriverReady/"+DriverUserName).child('lat').set(lat);
        await database.ref("DriverReady/"+DriverUserName).child('lng').set(lng);
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

async function DriverNewMissionNotify(DriverUserName,NotifyId) {   
    var status = false;
    var CheckReadyStatus;
    await CheckIfDriverOnMission(DriverUserName).then((data)=>{
        if(data === true)
        {
            CheckReadyStatus = true;
        }
        return;
    });
    if(CheckReadyStatus === true)
    {
        database.ref('DriverOnMission/'+DriverUserName).child('Notification').set(NotifyId);
        status = true;
    }
    else
    {
        status = false;
    }
    return status;
}

module.exports.SignUp = SignUp;
module.exports.SignIn = SignIn;
module.exports.DriverUploadPosition = DriverUploadPosition;
module.exports.DriverNewMissionNotify = DriverNewMissionNotify;



