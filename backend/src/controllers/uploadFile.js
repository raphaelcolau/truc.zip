const { default: axios } = require('axios');
const File = require('../models/files.model.js');

exports.uploadFile = async (req, res) => {
    const file = req.files.file;

    if (!file) res.status(400).send("No file uploaded");

    res.status(200).send({
        fileName: file.name,
    });

}