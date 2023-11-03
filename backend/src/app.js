const app = require('express')();
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const fileUpload = require("express-fileupload");
const cors = require('cors');
const config = require('./config/config');
const connectDB = require('./config/db.config.js');
const fs = require('fs');
const http = require('http');
const https = require('https');


// Setup CORS options ony for localhost, localnetwork and truc.zip
const corsOptions = {origin: function (origin, callback) {
    if (origin === undefined || origin.includes("localhost") || origin.includes("192.168") || origin.includes("truc.zip")) {
        callback(null, true);
    } else {
        callback(new Error('Not allowed by CORS'));
    }
}};

// Load CORS with options
app.use(cors(corsOptions));

// Parse requests of content-type - application/json
app.use(bodyParser.json());

// Parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//Compress all routes
app.use(compression());

// Helmet for security
app.use(helmet());

//File upload middleware
app.use(fileUpload({
    defCharset: 'utf-8',
    defParamCharset: 'utf-8',
    preserveExtension: true,
}));

// Function routes
app.use('/files/', require('./routes/files.route'));

try {
    if (fs.existsSync('./sslcert/privkey.pem') && fs.existsSync('./sslcert/cert.pem')) {
        console.log("SSL Cert files found, loading it...");
        const privateKey = fs.readFileSync('./sslcert/privkey.pem', 'utf8');
        const certificate = fs.readFileSync('./sslcert/cert.pem', 'utf8');
        
        var credentials = {key: privateKey, cert: certificate};
        var httpsServer = https.createServer(credentials, app);
        config.getConfig().then((param) => {
            httpsServer.listen(param.SERVER_PORT_HTTPS, function () {
                console.log("\x1b[46m%s\x1b[0m", "Starting Server on " + param.SERVER_PORT_HTTPS + " port");
            });
        
            connectDB(param.DB_URI);
        });
    } else {
        throw new Exception();
    }
} catch (error) {
    console.log('\x1b[41m%s\x1b[0m', "Cannot find sslcert files, unable to start HTTPS server");

    if(!fs.existsSync('./sslcert')) {
        fs.mkdirSync('./sslcert', { recursive: true }, (err) => {
            if (err) throw err;
        }, console.log("sslcert folder created, place your sslcert files in it (privkey.pem and cert.pem)"));
    }

    var httpServer = http.createServer(app);
    config.getConfig().then((param) => {
        httpServer.listen(param.SERVER_PORT_HTTP, function () {
            console.log("\x1b[44m%s\x1b[0m", "Starting Server on " + param.SERVER_PORT_HTTP + " port");
        });
    
        connectDB(param.DB_URI);
    });
}

