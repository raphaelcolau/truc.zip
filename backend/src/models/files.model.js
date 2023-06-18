const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: false
    },
    url: {
        type: String,
        unique: true,
        required: true,
    },
    size: {
        type: Number,
        required: true,
        unique: false
    },
    type: {
        type: String,
        required: true,
        unique: false
    },
    md5: {
        type: String,
        required: true,
        unique: false
    },
    download_count: {
        type: Number,
        required: true,
        unique: false,
        default: 0
    },
    last_download: {
        type: Date,
        required: false,
        unique: false,
        default: Date.now()
    },
    created_by: {
        type: String,
        required: true,
        unique: false
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('File', FileSchema);