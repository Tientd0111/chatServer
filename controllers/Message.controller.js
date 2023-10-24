const Message = require("../models/Message.model");

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
    if(!!data){
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
    }
}