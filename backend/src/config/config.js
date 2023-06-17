const fs = require('fs');

exports.getConfig = async () => {
    const VERSION = "1.1.0";
    const SERVER_PORT_HTTP = "8000";  // HTTP port
    let SERVER_PORT_HTTPS = ""; // HTTPS port
    let SERVER_HOST = ''; // Server host
    let DB_URI = ''; // Database url

    try {
        if(fs.existsSync('./config/config.cfg')) {
            console.log("Config file found, loading it...");
            const data = fs.readFileSync('./config/config.cfg', 'utf8');
            const lines = data.split(/\r?\n/);
            if (lines[0].includes("HTTPS_PORT=")) {
                SERVER_PORT_HTTPS = lines[0].replace("HTTPS_PORT=", "");
            }
            if (lines[1].includes("SERVER_HOST=")) {
                SERVER_HOST = lines[1].replace("SERVER_HOST=", "");
            }
            if (lines[2].includes("DB_URI=")) {
                DB_URI = lines[2].replace("DB_URI=", "");
            }
        } else {
            throw new Exception();
        }
    } catch (error) {
        console.log("Cannot find config file, creating it...");
        SERVER_PORT_HTTPS = 8001;
        SERVER_HOST = "http://localhost:8001";
        DB_URI = "mongodb://localhost:27017/licences?authSource=admin";
        fs.mkdirSync('./config', { recursive: true }, (err) => {
            if (err) throw err;
        });
        if(!fs.existsSync('./config/whitelist.cfg')) {fs.appendFileSync('./config/whitelist.cfg', "::1\n127.0.0.1");}

        fs.writeFileSync('./config/config.cfg',
            'HTTPS_PORT=8001\nSERVER_HOST=https://localhost:8001\nDB_URI=mongodb://localhost:27017/licences?authSource=admin',
            (err) => {
                if (err) throw err;
                console.log('The file has been saved!');
            });
    }

    return ({SERVER_PORT_HTTP, SERVER_PORT_HTTPS, SERVER_HOST, DB_URI, VERSION})
}
