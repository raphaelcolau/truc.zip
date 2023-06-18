const { default: axios } = require('axios');
const File = require('../models/files.model.js');
const fs = require('fs');

exports.downloadFile = async (req, res) => {
    const url = req.params.id;
    if (!url) return res.status(400).send({error: 'No url was provided.'});
    try {
        File.findOne({ url: url }).then((file) => {
            if (!file) return res.status(404).send({error: 'File not found.'});
            
            const localPath = './files/' + url + '/' + file.name;
            const fileData = fs.readFileSync(localPath);
            if (!fileData) return res.status(404).send({error: 'File not found.'});

            res.download(
                localPath,
                file.name,
                (err) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).send({error: "Error while downloading file"});
                    }
                    file.download_count += 1;
                    file.last_download = Date.now();
                    file.save();
                }
            )
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({error: "Error while deleting file"});
    }
}