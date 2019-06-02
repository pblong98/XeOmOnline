
const url  = 'mongodb+srv://admin:Long251122844@cluster0-whpky.gcp.mongodb.net/XeOmOnlineDB?retryWrites=true'
var mongoose = require('mongoose');
var db = mongoose.connection;
 
db.on('error', console.error);

var DriverAccountSchema = new mongoose.Schema({
    username:String, password: String, name: String, phone: String, lisense: String
});

mongoose.connect(url);

var DriverAccount = mongoose.model('DriverAccount', DriverAccountSchema);

function SaveDriverAccount(username, password, name, phone, lisense)
{
    var thor = new DriverAccount({
        username:username, password: password, name: name, phone: phone, lisense: lisense
    });

    thor.save(function (err, thor) {
        if (err) return console.error(err);
    });
}

module.exports.SaveDriverAccount = SaveDriverAccount;

