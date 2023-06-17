const { default: axios } = require('axios');
const File = require('../models/files.model.js');

exports.getFile = async (req, res) => {
    const id = req.params.id;

    if (!id) return res.status(400).send('No id was provided.');

    try {
        File.findOne({ url: id }).then((file) => {
            console.log(file)
            if (!file) return res.status(404).send({error: 'File not found.'});
            return res.status(200).send({
                name: file.name,
                url: file.url,
                type: file.type,
                size: file.size,
                md5: file.md5,
                download_count: file.download_count,
            });
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({error: "Error while getting file"});
    }
}