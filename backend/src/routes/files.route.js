const express = require('express');
const router = express.Router();
const { deleteFile } = require('../controllers/deleteFile');
const { getFile } = require('../controllers/getFile');
const { uploadFile } = require('../controllers/uploadFile');

router.get("/", getFile); // GET a file by id
router.post("/", uploadFile) // POST a file
router.delete("/", deleteFile) // DELETE a file by id

module.exports = router;
