const StoriesModel = require("../models/Stories.model");

exports.createStory = async (req, res) => {
	const data = req.body
	if(!!data) {
		try {
			const story = new StoriesModel({
				user: data.user,
                file: data.file
			});
			await conversation.save()
			res.send({success: true, msg: 'thành công'})
		} catch (err) {
			res.send({status: 409, msg: 'invalid_data'})
		}
	} else res.send({status: 409, msg: 'invalid_data'})
};
exports.getStoryById = async (req,res) => {
    const data = req.params 
    if(!!data){
        try{
            const list = await StoriesModel.find({user: data.id, delete: 0}).lean()
            const listStory = await Promise.all(list.map((x)=>{
                return {
                    _id: x._id,
                    file: x.file,
                    created_at: x.created_at,
                }
            }))
            return res.send({story: listStory})
        }catch(e){
            console.log(e);
        }
    }
}