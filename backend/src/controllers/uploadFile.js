const { default: axios } = require('axios');
const File = require('../models/files.model.js');

exports.uploadFile = async (req, res) => {
    res.send("upload");
}