const express = require('express');
const router = express.Router();
const { deleteFile } = require('../controllers/deleteFile');
const { getFiles } = require('../controllers/getFile');
const { uploadFile } = require('../controllers/uploadFile');

router.get("/", getFiles); // GET a file by id
router.post("/", uploadFile) // POST a file
router.delete("/", deleteFile) // DELETE a file by id

module.exports = router;
