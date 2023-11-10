const StoriesModel = require("../models/Stories.model");
const authMethod = require('../services/auth.service');
const jwtVariable = require('../constant/jwt');
exports.createStory = async (req, res) => {
	const data = req.body
    const accessTokenFromHeader = req.header('Authorization')?.replace('Bearer ', '');
	if (!accessTokenFromHeader) {
		return reqHelper(req, res, { status: 400, msg: 'token_not_found' })
	}
	const accessTokenSecret =
		process.env.ACCESS_TOKEN_SECRET || jwtVariable.accessTokenSecret;
	// Decode access token đó
	const decoded = await authMethod.decodeToken(
		accessTokenFromHeader,
		accessTokenSecret,
	);
	
	if(!!data) {
		try {
            if (!decoded) {
                return reqHelper(req, res, { status: 400, msg: 'token_not_valid' })
            }
            const _id = decoded.payload._id;
			const story = new StoriesModel({
				user: _id,
                file: data.file
			});
			await story.save()
			res.send({success: true, msg: 'thành công'})
		} catch (err) {
			res.send({status: 409, msg: 'invalid_data'})
		}
	} else res.send({status: 409, msg: 'invalid_data'})
};

exports.getStoryById = async (req,res) => {
    const data = req.params 
    if(!!data){
        try{
            const list = await StoriesModel.find({user: data.id, delete: 0}).lean()
            const listStory = await Promise.all(list.map((x)=>{
                return {
                    _id: x._id,
                    file: x.file,
                    created_at: x.created_at,
                }
            }))
            return res.send({story: listStory})
        }catch(e){
            console.log(e);
        }
    }
}