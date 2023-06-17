const { default: axios } = require('axios');
const File = require('../models/files.model.js');
const fs = require('fs');

exports.uploadFile = async (req, res) => {
    const file = req.files.files;

    if (!file) {
        return res.status(400).send('No files were uploaded.');
    };

    try {
        const randomId = Math.random().toString(36).substring(2, 8);
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
        const fileData = new File({
            name: file.name,
            url: randomId,
            type: file.mimetype,
            size: file.size,
            md5: file.md5,
            created_by: ip,
        });
        await fileData.save();

        fs.mkdirSync('./files/' + randomId, { recursive: true }, (err) => {
            if (err) throw err;
        });
        fs.writeFileSync('./files/' + randomId + '/' + file.name, file.data, (err) => {
            if (err) throw err;
        });
        
        res.status(200).send({
            url: randomId,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send("Error while uploading file");
    }

}