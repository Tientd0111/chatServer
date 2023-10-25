const Conversation = require("../models/Conversation.model");
const MessageModel = require("../models/Message.model");
const UserModel = require("../models/User.model");
const { resConversation } = require("../utils/resultObj");

exports.addFriend = async (req, res) => {
	const data = req.body
	if(!!data) {
		const user1 = await Conversation.findOne({user_1: data.user_1,user_2: data.user_2})
		const user2 = await Conversation.findOne({user_1: data.user_2,user_2: data.user_1})
		if(user1 || user2) return res.send({status: 409, msg: 'tồn tại'})
		try {
			const conversation = new Conversation({
				user_1: data.user_1,
				user_2: data.user_2,
			});
			await conversation.save()
			res.send({success: true, msg: 'thành công'})
		} catch (err) {
			res.send({status: 409, msg: 'invalid_data'})
		}
	} else res.send({status: 409, msg: 'invalid_data'})
};