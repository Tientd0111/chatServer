const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/auth.middlewares')
const Roles = require('../constant/role')

const UploadFileController = require('../controllers/UploadFile.controller');

const { v4: uuidv4 } = require('uuid');
const multer = require("multer");


const DIR = './upload/';

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, DIR);
	},
	filename: (req, file, cb) => {
		const fileName = file.originalname.toLowerCase().split(' ').join('-');
		cb(null, fileName)
	}
});

const upload = multer({
	storage: storage,
	fileFilter: (req, file, cb) => {
		if (file.mimetype === "image/png" ||file.mimetype === "image/webp" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
			cb(null, true);
		} else {
			cb(null, false);
			return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
		}
	}
});

router.post('/upload', upload.single('image'),UploadFileController.upload);
module.exports = router;
