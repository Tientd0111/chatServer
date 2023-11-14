const Conversation = require("../models/Conversation.model");
const MessageModel = require("../models/Message.model");
const UserModel = require("../models/User.model");
const { resConversation } = require("../utils/resultObj");


exports.createConversation = async (req, res) => {
    const { user_1, user_2 } = req.body;
    if (user_1 && user_2) {
        try {
            const conversation = await Conversation.findOneAndUpdate(
                { $or: [{ user_1, user_2 }, { user_1: user_2, user_2: user_1 }] },
                { $set: { user_1, user_2 } },
                { new: true, upsert: true }
            ).populate('user_1', 'name avatar').populate('user_2', 'name avatar').lean();
            return res.send({ status: 200, conversation });
        } catch (err) {
            return res.send({ status: 409, msg: err });
        }
    } else {
        return res.send({ status: 409, msg: 'invalid_data' });
    }
};
// exports.getMyConversation = async (req, res) => {
//     const data = req.params
//     if(!!data){
//         try{
//             const list_1 = await Conversation.find({user_1: data.id}) 
//             const list_2 = await Conversation.find({user_2: data.id}) 
//             const list = list_1.concat(list_2)
//             const listConversation = await Promise.all(list.map(async (x) => {
//                 const user_1 = await UserModel.findById({_id: x.user_1})
//                 const user_2 = await UserModel.findById({_id: x.user_2})
//                 const message = await MessageModel.find({conversation_id: x._id})
//                 return {
//                     _id: x._id,
//                     user_1: user_1,
//                     user_2: user_2,
//                     message: message[message.length - 1]
//                 }
//             }))
//             return res.send({conversation: listConversation})
//         }catch (e){
//             console.log(e);
//         }
//     }
// }
exports.getMyConversation = async (req, res) => {
    const data = req.params
    if(!!data){
        try{
            const list_1 = await Conversation.find({user_1: data.id}).populate('user_1', 'name avatar cover').populate('user_2', 'name avatar cover') 
            const list_2 = await Conversation.find({user_2: data.id}).populate('user_1', 'name avatar cover').populate('user_2', 'name avatar cover') 
            const list = list_1.concat(list_2)
            const listConversation = await Promise.all(list.map(async (x) => {
                const message = await MessageModel.find({conversation_id: x._id}).populate('sender', 'name avatar')
                return {
                    _id: x._id,
                    user_1: x.user_1,
                    user_2: x.user_2,
                    message: message[message.length - 1]
                }
            }))
            return res.send({conversation: listConversation})
        }catch (e){
            console.log(e);
        }
    }
}
// exports.getConversationById = async (req, res) => {
//     const data = req.params
//     if(!!data){
//         try{
//             const conversation = await Conversation.findById({_id: data.id}).then(async res => {
//                 const user_1 = await UserModel.findById({_id: res.user_1}) 
//                 const user_2 = await UserModel.findById({_id: res.user_2}) 
//                 return {
//                     _id: res._id,
//                     user_1: user_1,
//                     user_2: user_2,
//                 }
//             }) 
            
//             return res.send({conversation: resConversation(conversation)})
//         }catch (e){
//             console.log(e);
//         }
//     }
// }
exports.getConversationById = async (req, res) => {
    const data = req.params
    if(!!data){
        try{
            const conversation = await Conversation.findById({_id: data.id}).populate('user_1', 'name avatar cover').populate('user_2', 'name avatar cover').lean()
            return res.send({conversation: resConversation(conversation)})
        }catch (e){
            console.log(e);
        }
    }
}
