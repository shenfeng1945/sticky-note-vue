const express = require('express') ;
const bodyParser = require('body-parser') 
const cors = require('cors') 
const passport = require('passport') 
const cookieParse = require('cookie-parser')
const session = require('express-session')
const fs = require('fs')
const https = require('https')

// var index = require('./routes/index');
// var users = require('./routes/users');
var api = require('./routes/api');
var auth = require('./routes/auth');


const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())
app.use(cookieParse());
app.use(session({secret: 'sessionsecret'}));
app.use(passport.initialize())
app.use(passport.session())

// app.use('/', index);
app.use('/api', api);//ajax请求
// app.use('/users', users);
app.use('/auth',auth)

const key = fs.readFileSync('/etc/letsencrypt/live/shenfeng1945.xyz/privkey.pem','utf8');
var cert = fs.readFileSync('/etc/letsencrypt/live/shenfeng1945.xyz/cert.pem','utf8');
var options = {
    key: key,
    cert: cert
};
// app.listen(6060,()=>console.log('localhost:6060'))
https.createServer(options,app).listen(6060);

