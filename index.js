var express = require('express');
var fs = require('fs');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());

app.post('/api/login', function(req, res) {
    var username = req.body.username; 
 	var passhash = req.body.passhash;
    var datafile = undefined;
    var statusfile = undefined;
     try {
         datafile = fs.readFileSync('reg_' + username + '.txt', 'utf8');
     } catch (e){
         res.send("unregistered");
     }
     try {
        statusfile = fs.readFileSync('sta_' + username + '.txt', 'utf8');
     } catch (e) {
         if (datafile != undefined){
             res.send("fs-sta-notexsists");
             console.log("fs-sta-notexsists, sta_" + username + ".txt");
         }
     }
    if (datafile != undefined){
        if (datafile == username + ":" + passhash){
            if (statusfile != undefined){
                if (statusfile == 0){
                    var errchk = fs.writeFileSync('sta_' + username + '.txt', '1', 'utf8');
                    if (errchk == undefined){
                        res.send("1");
                    } else {
                        res.send("fs-err");
                        console.log("fs-err, " + errchk);
                    }
                } else if (statusfile == 1){
                    res.send("already logged in");
                } else if (statusfile == 2){
                    res.send("banned");
                } else {
                    res.send("invalid status file");
                    console.log("invalid status file, sta_" + username + ".txt");
                }
            } else {
                try {
                    res.send("fs-sta-empty");
                    console.log("an error happened, sta_" + username + ".txt is empty, but reg_" + username + ".txt is okay.");
                } catch (e){
                    
                }
            }
        } else {
            res.send("wrong username/passhash");
        }
    } else {
        try {
            res.send("fs-reg-empty");
            console.log("fs-reg-empty, reg_" + username + ".txt");
        } catch (e){
            
        }
    }
});

app.post('/api/logout', function(req, res) {
    var username = req.body.username; 
 	var passhash = req.body.passhash;
    var datafile = undefined;
    var statusfile = undefined;
     try {
         datafile = fs.readFileSync('reg_' + username + '.txt', 'utf8');
     } catch (e){
         res.send("unregistered");
     }
     try {
        statusfile = fs.readFileSync('sta_' + username + '.txt', 'utf8');
     } catch (e) {
         if (datafile != undefined){
             res.send("fs-sta-notexsists");
             console.log("fs-sta-notexsists, sta_" + username + ".txt");
         }
     }
    if (datafile != undefined){
        if (datafile == username + ":" + passhash){
            if (statusfile != undefined){
                if (statusfile == 0){
                    res.send("already logged out")
                } else if (statusfile == 1){
                    var errchk = fs.writeFileSync('sta_' + username + '.txt', '0', 'utf8');
                    if (errchk == undefined){
                        res.send("1");
                    } else {
                        res.send("fs-err");
                        console.log("fs-err, " + errchk);
                    }
                } else if (statusfile == 2){
                    res.send("banned");
                } else {
                    res.send("invalid status file");
                    console.log("invalid status file, sta_" + username + ".txt");
                }
            } else {
                try {
                    res.send("fs-sta-empty");
                    console.log("an error happened, sta_" + username + ".txt is empty, but reg_" + username + ".txt is okay.");
                } catch (e){
                    
                }
            }
        } else {
            res.send("wrong username/passhash");
        }
    } else {
        try {
            res.send("fs-reg-empty");
            console.log("fs-reg-empty, reg_" + username + ".txt");
        } catch (e){
            
        }
    }
});

app.get('/', function (req, res) {
  res.send('ready'); //Signal for Unity code: "this server works"
});

app.listen(8080);