const ConversationModel = require("../models/Conversation.model");
const MessageModel = require("../models/Message.model");
const Message = require("../models/Message.model");
const UserModel = require("../models/User.model");
const { resUser } = require("../utils/resultObj");

exports.createMessage = async (data) => {
	if(!!data) {
		try {
			const message = new Message({
				conversation_id: data.conversation,
                sender: data.sender,
                content: data.content
			});
			await message.save()
			return true
		} catch (err) {
            return false
			// res.send({status: 409, msg: 'invalid_data'})
		}
	} else res.send({status: 409, msg: 'invalid_data'})
};

exports.getMessageByConversation = async (req, res) => {
    const data = req.params
    if(!!data){
        try{
            const list = await MessageModel.find({conversation_id: data.id})
            const message = await MessageModel.find({conversation_id: data.id})
            const listMessage = await Promise.all(message.map(async (x) => {
                const sender = await UserModel.findById({_id: x.sender})
                // const message = await MessageModel.find({conversation_id: x.conversation_id})
                return {
                    _id: x._id,
                    conversation_id: data.id,
                    sender: resUser(sender),
                    content: x.content
                }
            }))
            return res.send({message: listMessage})
        }catch (e){
            console.log(e);
        }
    }
}