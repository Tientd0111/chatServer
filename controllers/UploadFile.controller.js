const UploadFileModel = require("../models/UploadFile.model")

exports.upload = async (req,res) =>{
	const url = req.protocol + '://' + req.get('host')
	try {
		if(!!req){
			res.send({file: req.file.filename})
		}
	}catch (e) {
		console.log(e)
	}
}