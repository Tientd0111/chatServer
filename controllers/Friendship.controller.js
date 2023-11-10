const FriendshipModel = require("../models/Friendship.model");
const NotificationModel = require("../models/Notification.model");
const UserModel = require("../models/User.model");
const { resUser, resFriend } = require("../utils/resultObj");
const authMethod = require('../services/auth.service');
const jwtVariable = require('../constant/jwt');
exports.addFriend = async (data) => {
	if (!!data) {
		const sentFrom = await FriendshipModel.findOne({ sent_from: data.sent_from, arrive: data.arrive })
		const arrive = await FriendshipModel.findOne({ sent_from: data.arrive, arrive: data.sent_from })
		if (sentFrom || arrive) return res.send({ status: 409, msg: 'tồn tại' })

		const sent = await UserModel.findById({ _id: data.sent_from })
		const arriveInfo = await UserModel.findById({ _id: data.arrive })

		try {
			const friend = new FriendshipModel({
				sent_from: data.sent_from,
				arrive: data.arrive,
			});
			const resFriend = await friend.save()

			const notification = new NotificationModel({
				from: data.sent_from,
				to: data.arrive,
				type: 3,
				friendship_id: resFriend?._id
			})
			const resNoti = await notification.save()
			return ({ friendship_id: resFriend._id, from: resUser(sent), to: resUser(arriveInfo), type: 3 })
		} catch (err) {
			// res.send({status: 409, msg: 'invalid_data'})
			console.log('====================================');
			console.log(err);
			console.log('====================================');
		}
	} else res.send({ status: 409, msg: 'invalid_data' })
};

exports.getMyFriend = async (req, res) => {
	const accessTokenFromHeader = req.header('Authorization')?.replace('Bearer ', '');
	if (!accessTokenFromHeader) {
		return reqHelper(req, res, { status: 400, msg: 'token_not_found' })
	}
	const accessTokenSecret =
		process.env.ACCESS_TOKEN_SECRET || jwtVariable.accessTokenSecret;
	// Decode access token đó
	const decoded = await authMethod.decodeToken(
		accessTokenFromHeader,
		accessTokenSecret,
	);
	if (!decoded) {
		return reqHelper(req, res, { status: 400, msg: 'token_not_valid' })
	}
	const _id = decoded.payload._id;
	try {
		const sent_from = await FriendshipModel.find({ sent_from: _id, status: 1 }).populate('sent_from', 'name avatar').populate('arrive', 'name avatar')
		const arrive = await FriendshipModel.find({ arrive: _id, status: 1 }).populate('sent_from', 'name avatar').populate('arrive', 'name avatar')
		const list = sent_from.concat(arrive)
		const listFriend = await Promise.all(list.map(async (x) => {
			return {
				_id: x._id,
				user: _id === x.sent_from._id.toString() ? resUser(x.arrive) : resUser(x.sent_from),
				status: x.status
			}
		}))
		return res.send({ friend: listFriend })
	} catch (e) {
		console.log(e);
	}
}


exports.getFriendById = async (req, res) => {
	const data = req.params
	const accessTokenFromHeader = req.header('Authorization')?.replace('Bearer ', '');
	if (!accessTokenFromHeader) {
		return reqHelper(req, res, { status: 400, msg: 'token_not_found' })
	}
	const accessTokenSecret =
		process.env.ACCESS_TOKEN_SECRET || jwtVariable.accessTokenSecret;
	const decoded = await authMethod.decodeToken(
		accessTokenFromHeader,
		accessTokenSecret,
	);
	if (!decoded) {
		return reqHelper(req, res, { status: 400, msg: 'token_not_valid' })
	}
	const _id = decoded.payload._id;
	if (!!data) {
		try {
			const friend = await FriendshipModel.findById({ _id: data.id }).lean();
			const user = await friend.sent_from.toString() === _id ?
				await UserModel.findById({ _id: friend.arrive }).lean() :
				await UserModel.findById({ _id: friend.sent_from }).lean();
			const list = await FriendshipModel.find({ $or: [{ sent_from: _id }, { arrive: _id }], status: 1 }).populate('sent_from').populate('arrive').lean();
			const newList = list.filter((item) => item._id.toString() !== data.id);
			const totalMutual = newList.length;
			const totalContact = list.length;
			const listFriend = newList.map((x) => {
				return {
					_id: x._id,
					user: _id === x.sent_from._id.toString() ?
						{
							_id: x.arrive._id,
							avatar: x.arrive.avatar,
							name: x.arrive.name,
							nickname: x.arrive.nickname
						} :
						{
							_id: x.sent_from._id,
							avatar: x.sent_from.avatar,
							name: x.sent_from.name,
							nickname: x.sent_from.nickname
						},
					status: x.status
				};
			});
			return res.send({ user: resUser(user), mutual: totalMutual, contact: totalContact, listMutual: listFriend });
		} catch (e) {
			console.log(e);
		}
	}	
}

// 