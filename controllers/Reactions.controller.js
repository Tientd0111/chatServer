const authMethod = require('../services/auth.service');
const jwtVariable = require('../constant/jwt');
const ReactionsModel = require('../models/Reactions.model');
exports.createReaction = async (req, res) => {
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
			const react = new ReactionsModel({
				user: _id,
                message: data.message_id,
                reaction: data.reaction
			});
			await react.save()
			res.send({success: true, msg: 'thành công'})
		} catch (err) {
			res.send({status: 409, msg: 'invalid_data'})
		}
	} else res.send({status: 409, msg: 'invalid_data'})
};