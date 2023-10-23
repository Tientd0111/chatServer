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