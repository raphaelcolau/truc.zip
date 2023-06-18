const { default: axios } = require('axios');
const File = require('../models/files.model.js');
const fs = require('fs');

exports.deleteFile = async (req, res) => {
    const url = req.params.id;
    if (!url) return res.status(400).send({error: 'No url was provided.'});
    try {
        File.findOneAndDelete({ url: url }).then((file) => {
            if (!file) return res.status(404).send({error: 'File not found.'});
            return res.status(200).send("File deleted successfully.");
        });
        fs.rm('./files/' + url, { recursive: true }, (err) => {
            if (err) throw err;
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({error: "Error while deleting file"});
    }
}