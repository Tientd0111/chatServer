const Conversation = require("../models/Conversation.model");
const FriendshipModel = require("../models/Friendship.model");
const MessageModel = require("../models/Message.model");
const NotificationModel = require("../models/Notification.model");
const UserModel = require("../models/User.model");
const { resConversation, resUser } = require("../utils/resultObj");
const authMethod = require('../services/auth.service');
const jwtVariable = require('../constant/jwt');

exports.getMyNotification = async (req, res) => {
  // Lấy access token từ header
	const accessTokenFromHeader = req.header('Authorization')?.replace('Bearer ', '');
	if (!accessTokenFromHeader) {
		return reqHelper(req, res, {status: 400, msg: 'token_not_found'})
	}

	const accessTokenSecret =
		process.env.ACCESS_TOKEN_SECRET || jwtVariable.accessTokenSecret;
	const accessTokenLife =
		process.env.ACCESS_TOKEN_LIFE || jwtVariable.accessTokenLife;

	// Decode access token đó
	const decoded = await authMethod.decodeToken(
		accessTokenFromHeader,
		accessTokenSecret,
	);
	if (!decoded) {
		return reqHelper(req, res, {status: 400, msg: 'token_not_valid'})
	}

	const _id = decoded.payload._id;

	const list = await NotificationModel.find({to: _id}).sort({created_at: -1})
  try{
    const listNoti = await Promise.all(list.map(async (x) =>{
      const from = await UserModel.findById({_id: x.from})
      const arrive = await UserModel.findById({_id: x.to})
      return {
        _id: x._id,
        from: resUser(from),
        to: resUser(arrive),
        friendship_id: x.friendship_id,
        type: x.type,
        created_at: x.created_at
      }
    }))
    return res.send({notification: listNoti})
  }catch (e){
    console.log(e);
  }
};