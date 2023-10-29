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
	const accessTokenLife =
		process.env.ACCESS_TOKEN_LIFE || jwtVariable.accessTokenLife;

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
		const sent_from = await FriendshipModel.find({ sent_from: _id, status: 1 })
		const arrive = await FriendshipModel.find({ arrive: _id, status: 1 })
		const list = sent_from.concat(arrive)
		const listFriend = await Promise.all(list.map(async (x) => {
			const sent_from = await UserModel.findById({ _id: x.sent_from })
			const arrive = await UserModel.findById({ _id: x.arrive })
			return {
				_id: x._id,
				user: _id === x.sent_from.toString() ? resUser(arrive) : resUser(sent_from),
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
	const accessTokenLife =
		process.env.ACCESS_TOKEN_LIFE || jwtVariable.accessTokenLife;

	// Decode access token đó
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
			const friend = await FriendshipModel.findById({ _id: data.id })
			const user = await friend.sent_from.toString() === _id ?
				await UserModel.findById({ _id: friend.arrive }) :
				await UserModel.findById({ _id: friend.sent_from })
			const sent_from = await FriendshipModel.find({ sent_from: _id, status: 1 }).lean()
			const arrive = await FriendshipModel.find({ arrive: _id, status: 1 }).lean()
			const list = sent_from.concat(arrive)
			const newList = list.filter((item) => item._id.toString() !== data.id);
			const totalMutual = newList.length
			const totalContact = list.length
			const listFriend = await Promise.all(newList.map(async (x) => {
				const sent_from = await UserModel.findById({ _id: x.sent_from })
				const arrive = await UserModel.findById({ _id: x.arrive })
				return {
					_id: x._id,
					user: _id === x.sent_from.toString() ?
						{
							_id: arrive._id,
							avatar: arrive.avatar,
							name: arrive.name,
							nickname: arrive.nickname
						} :
						{
							_id: sent_from._id,
							avatar: sent_from.avatar,
							name: sent_from.name,
							nickname: sent_from.nickname
						},
					status: x.status
				}
			}))

			return res.send({ user: resUser(user), mutual: totalMutual, contact: totalContact, listMutual: listFriend })
		} catch (e) {
			console.log(e);
		}
	}
}