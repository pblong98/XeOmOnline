const ServiceAccount = require("../xeomonlinebackend-firebase-adminsdk-03zi2-78fb8dab8e.json");
const admin = require('firebase-admin');
admin.initializeApp({
    credential: admin.credential.cert(ServiceAccount),
    databaseURL: "https://xeomonlinebackend.firebaseio.com"
});

// Get a reference to the database service
var database = admin.database();

async function SignUp(username, password) {
    var returnStatus = "nothing";
    await database.ref("DriverAccount").once('value').then(function(snapshot) {
        returnStatus = snapshot.val().Admin.Password;
    });
    return returnStatus;
    
    // console.log("out:      "+returnStatus)
    // return returnStatus;

    // database.ref("DriverAccount/"+username).set({
    //     AccessToken:"",
    //     Password: password
    // });
}


var mess = "Do an web 2 backend";
module.exports.mess = mess;
module.exports.SignUp = SignUp;


