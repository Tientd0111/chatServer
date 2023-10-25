const Conversation = require("../models/Conversation.model");
const MessageModel = require("../models/Message.model");
const UserModel = require("../models/User.model");
const { resConversation } = require("../utils/resultObj");

exports.createConversation = async (req, res) => {
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

exports.getMyConversation = async (req, res) => {
    const data = req.params
    if(!!data){
        try{
            const list_1 = await Conversation.find({user_1: data.id}) 
            const list_2 = await Conversation.find({user_2: data.id}) 
            const list = list_1.concat(list_2)
            const listConversation = await Promise.all(list.map(async (x) => {
                const user_1 = await UserModel.findById({_id: x.user_1})
                const user_2 = await UserModel.findById({_id: x.user_2})
                const message = await MessageModel.find({conversation_id: x._id})
                return {
                    _id: x._id,
                    user_1: user_1,
                    user_2: user_2,
                    message: message[message.length - 1]
                }
            }))
            return res.send({conversation: listConversation})
        }catch (e){
            console.log(e);
        }
    }
}
exports.getConversationById = async (req, res) => {
    const data = req.params
    if(!!data){
        try{
            const conversation = await Conversation.findById({_id: data.id}).then(async res => {
                const user_1 = await UserModel.findById({_id: res.user_1}) 
                const user_2 = await UserModel.findById({_id: res.user_2}) 
                return {
                    _id: res._id,
                    user_1: user_1,
                    user_2: user_2,
                }
            }) 
            
            return res.send({conversation: resConversation(conversation)})
        }catch (e){
            console.log(e);
        }
    }
}