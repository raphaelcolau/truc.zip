const { default: axios } = require('axios');
const File = require('../models/files.model.js');

exports.deleteFile = async (req, res) => {
    res.send("deleteFile");
}