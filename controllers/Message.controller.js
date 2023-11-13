const ConversationModel = require("../models/Conversation.model");
const MessageModel = require("../models/Message.model");
const Message = require("../models/Message.model");
const UserModel = require("../models/User.model");
const { resUser } = require("../utils/resultObj");

exports.createMessage = async (data) => {
	if(!!data) {
		try {
			const message = new Message({
				conversation_id: data.conversation_id,
                sender: data.sender,
                content: data.content,
                message_image: data.message_image,
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
            const message = await MessageModel.find({ conversation_id: data.id })
                .populate('sender', 'name avatar')
                .select('_id conversation_id sender content message_image')
                .lean();
            return res.send({message})
        }catch (e){
            console.log(e);
        }
    }
}



// exports.getListImageByConversation = async (req,res) => {
//     const data = req.params
//     try{
//         const list = await MessageModel.find({conversation_id: data.id, content: undefined}).lean()
//         const list_image = await Promise.all(list.map((x)=>{
//             return x.message_image
//         }))
//         return res.send({list_image: list_image})
//     }catch (e){ 
//         console.log(e);
//     }
// }
exports.getListImageByConversation = async (req,res) => {
    const data = req.params
    try{
        const list = await MessageModel.find({conversation_id: data.id, content: undefined}).select('message_image').lean()
        const list_image = list.map((x)=>{
            return x.message_image
        })
        return res.send({status:200,list_image: list_image})
    }catch (e){ 
        console.log(e);
    }
}
