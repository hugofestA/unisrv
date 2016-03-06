var express = require('express');
var fs = require('fs');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());

app.post('/api/login', function(req, res) {
    //creating variables for post stuff
    var username = req.body.username; 
 	var passhash = req.body.passhash;
    //creating variables for error checking
    var datafile = undefined;
    var statusfile = undefined;
     try {
         //reading register file
         datafile = fs.readFileSync('reg_' + username + '.txt', 'utf8');
     } catch (e){
         //sending unregistered error
         res.send("unregistered");
     }
     try {
        //reading status file
        statusfile = fs.readFileSync('sta_' + username + '.txt', 'utf8');
     } catch (e) {
         //checking that reg file is readed or not
         if (datafile != undefined){
             //send status file not exsists message
             res.send("fs-sta-notexsists");
             //logging error to console
             console.log("fs-sta-notexsists, sta_" + username + ".txt");
         }
     }
    //checking if that reg file is readed or not
    if (datafile != undefined){
        //checking if that post data & regfile matches
        if (datafile == username + ":" + passhash){
            //checking if that status file is readed or not
            if (statusfile != undefined){
                //checking if that status is offline
                if (statusfile == 0){
                    //creating error check variable & creating file
                    var errchk = fs.writeFileSync('sta_' + username + '.txt', '1', 'utf8');
                    //if error not happened
                    if (errchk == undefined){
                        //send okay message
                        res.send("1");
                    } else { // if error happened
                        //send fs error message
                        res.send("fs-err");
                        //log to console
                        console.log("fs-err, " + errchk);
                    }
                } else if (statusfile == 1){ //checking that status is online
                    //sending already logged in message
                    res.send("already logged in");
                } else if (statusfile == 2){ // checking that status is banned
                    //sedding banned message
                    res.send("banned");
                    //logging to console
                    console.log("banned user(" + username + ") tried to log in.");
                } else { //if status file is corrupted
                    //sending corrupted message
                    res.send("invalid status file");
                    //logging to console
                    console.log("invalid status file, sta_" + username + ".txt");
                }
            } else { //if status file is not readed
                try {
                    //send fs status empty error message
                    res.send("fs-sta-empty");
                    //log to console
                    console.log("an error happened, sta_" + username + ".txt is empty, but reg_" + username + ".txt is okay.");
                } catch (e){ //anti-freakout catch
                    
                }
            }
        } else { //if post data & regfile not matches
            //send error
            res.send("wrong username/passhash");
        }
    } else { //if reg file is not readed
        try {
            //send error message
            res.send("fs-reg-empty");
            //log to console
            console.log("fs-reg-empty, reg_" + username + ".txt");
        } catch (e){
            //anti-freakout catch
        }
    }
});

//almost same as login, differences are commented
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
                //if status is logged out
                if (statusfile == 0){
                    res.send("already logged out")
                } else if (statusfile == 1){ //if status is logged in
                    //create error variable & edit status file
                    var errchk = fs.writeFileSync('sta_' + username + '.txt', '0', 'utf8');
                    //if error is not happened
                    if (errchk == undefined){
                        //send okay message
                        res.send("1");
                    } else {  //if error is happened
                        //send fs error message
                        res.send("fs-err");
                        //log to console
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

app.post('/api/register', function(req, res) {
    //creating variables for post stuff
    var username = req.body.username; 
 	var passhash = req.body.passhash;
    //readed file variable
    var datafile = undefined;
     try {
         //read reg file of users
         datafile = fs.readFileSync('reg_' + username + '.txt', 'utf8');
         //already registered error message, this only calls if readfilesync succeeded
         res.send("already registered");
     } catch (e){ //catch, this is called if the readfile returns an error message
           //error checking variable, write register file
           var errchk1 = fs.writeFileSync('reg_' + username + '.txt', username + ':' + passhash, 'utf8');
           if (errchk1 == undefined){ //if error is not happened
               //error checking variable, write status file
               var errchk2 = fs.writeFileSync('sta_' + username + '.txt', '0', 'utf8');
               if (errchk2 == undefined){ //if error is not happened
                    //send okay message
                    res.send("1");
               } else { // if error is happened
                    //send fs error message
                    res.send("fs-err");
                    //log to console
                    console.log("fs-err, errchk2, " + errchk2);
               }
           } else { //if error is happened
                //send fs error message
                res.send("fs-err");
                //log to console
                console.log("fs-err, errchk1, " + errchk1);
           }
     } 
});

app.post('/api/delete', function(req, res) {
    //creating variables for post stuff
    var username = req.body.username;
 	var passhash = req.body.passhash;
    //creating datafile variable for reg file & error checking
    var datafile = undefined;
    try {
        //read reg file into datafile variable
        datafile = fs.readFileSync('reg_' + username + '.txt', 'utf8');
    } catch (e){ //if an error happened
        //send unregistered error message
        res.send("unregistered");
    }
    //if datafile matches post data
    if (datafile == username + ":" + passhash){
        try {
            //delete files
            fs.unlinkSync('reg_' + username + '.txt');
            fs.unlinkSync('sta_' + username + '.txt');
            //log to console
            console.log("deleted " + username + "'s account");
            //send okay message
            res.send("1");
        } catch (e){ //if an error happened
            //send fs error
            res.send("fs-err");
            //log to console
            console.log("fs-err, delete");
        } 
    } else { //if datafile not matches post data
        res.send("wrong username/passhash");
    }
});

app.get('/', function (req, res) {
  res.send('ready'); //Signal for Unity code: "this server works"
});

//listen
app.listen(8080);