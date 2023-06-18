const express = require('express');
const router = express.Router();
const { deleteFile } = require('../controllers/deleteFile');
const { downloadFile } = require('../controllers/downloadFile');
const { getFile } = require('../controllers/getFile');
const { uploadFile } = require('../controllers/uploadFile');

router.get("/:id", getFile); // GET a file by id
router.post("/", uploadFile) // POST a file
router.delete("/:id", deleteFile) // DELETE a file by id
router.get("/download/:id", downloadFile) // DOWNLOAD a file by id

module.exports = router;
