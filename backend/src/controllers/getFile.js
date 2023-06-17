const { default: axios } = require('axios');
const File = require('../models/files.model.js');

exports.getFile = async (req, res) => {
    res.send("getFile");
}