const NotificationModel = require("../models/Notification.model");
const { resUser } = require("../utils/resultObj");
const authMethod = require('../services/auth.service');
const jwtVariable = require('../constant/jwt');

exports.getMyNotification = async (req, res) => {
  const accessTokenFromHeader = req.header('Authorization')?.replace('Bearer ', '');
  if (!accessTokenFromHeader) {
    return reqHelper(req, res, {status: 400, msg: 'token_not_found'})
  }
  const accessTokenSecret =
    process.env.ACCESS_TOKEN_SECRET || jwtVariable.accessTokenSecret;

  const decoded = await authMethod.decodeToken(
    accessTokenFromHeader,
    accessTokenSecret,
  );
  if (!decoded) {
    return reqHelper(req, res, {status: 400, msg: 'token_not_valid'})
  }

  const _id = decoded.payload._id;

  const list = await NotificationModel.find({to: _id}).sort({created_at: -1}).populate('from').populate('to').lean();
  const listNoti = list.map((x) => {
    return {
      _id: x._id,
      from: resUser(x.from),
      to: resUser(x.to),
      friendship_id: x.friendship_id,
      type: x.type,
      created_at: x.created_at
    };
  });
  return res.send({notification: listNoti});
};
