const express = require('express');
const router = express.Router();
const { deleteFile } = require('../controllers/deleteFile');
const { getFile } = require('../controllers/getFile');
const { uploadFile } = require('../controllers/uploadFile');

router.get("/:id", getFile); // GET a file by id
router.post("/:id", uploadFile) // POST a file
router.delete("/:id", deleteFile) // DELETE a file by id

module.exports = router;
