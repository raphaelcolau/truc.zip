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
        type: Object,
        required: true,
        unique: false
    },
    created_at: {
        type: Date,
        required: true,
        unique: false,
        default: Date.now()
    },
    updated_at: {
        type: Date,
        required: true,
        unique: false,
        default: Date.now()
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('File', FileSchema);