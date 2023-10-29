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
exports.upload_array = async (req,res) =>{
	const url = req.protocol + '://' + req.get('host')
	try {
		if(!!req){
			const list = await Promise.all(req.files.map((x)=>{
				return x.filename
			}))
			res.send({files: list})
		}
	}catch (e) {
		console.log(e)
	}
}