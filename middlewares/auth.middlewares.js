
const jwtVariable = require('../constant/jwt');

const userModel = require('../models/User.model');

const authMethod = require('../services/auth.service');
module.exports = authorize;
function authorize(roles = []) {

	if (typeof roles === 'string') {
		roles = [roles];
	}

	return [
		async (req, res, next) => {
			const accessTokenFromHeader = req.header('Authorization')?.replace('Bearer ', '');
			if (!accessTokenFromHeader) {
				return res.status(401).send({msg: 'Không tìm thấy access token!', status: 401});
			}
			const accessTokenSecret =
				process.env.ACCESS_TOKEN_SECRET || jwtVariable.accessTokenSecret;
			const verified = await authMethod.verifyToken(
				accessTokenFromHeader,
				accessTokenSecret,
			);
			if(!verified) {
				return res
					.status(401)
					.send({msg: 'Token not verified!', status: 401});
			}
			req.user = await userModel.findOne({username: verified.payload.username});
			if (roles.length && !roles.includes(req.user.role)) {
				// user's role is not authorized
				return res.status(401).json({ message: 'Unauthorized!' });
			}
			next();
		}
	];
}

