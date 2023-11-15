const randToken = require("rand-token");
const bcrypt = require("bcrypt");
const userObj = require("../utils/objRsUser");
const User = require("../models/User.model");
const authMethod = require("../services/auth.service");
const jwtVariable = require("../constant/jwt");
const { SALT_ROUND } = require("../constant/auth");
const roles = require("../constant/role");
const { resUser } = require("../utils/resultObj");
const http = require('http');

async function getNetworkIP() {
	return new Promise((resolve, reject) => {
		http.get({'host': 'api.ipify.org', 'port': 80, 'path': '/'}, function(resp) {
			resp.on('data', function(ip) {
				resolve(ip)
			});
		});
	})

}

exports.register = async (req, res) => {
  const data = req.body;
  const username = req.body.username;
  if (
    !!data &&
    !!data.name &&
    !!data.username &&
    !!data.password &&
    !!data.phone
  ) {
    const user = await User.findOne({ username: data.username });
    const userp = await User.findOne({ phone_number: data.phone });
    const hashPassword = bcrypt.hashSync(data.password, SALT_ROUND);
    if (user) return res.send({ status: 409, msg: "Tên đăng nhập đã tồn tại" });
    if (userp)
      return res.send({ status: 409, msg: "Số điện thoại đã tồn tại" });
    try {
      const user = new User({
        name: data.name,
        username: username.toLowerCase(),
        email: data.email,
        password: hashPassword,
        role: roles.USER,
        phone_number: data.phone,
      });
      await user.save();
      res.send({ success: true, msg: "Đăng ký thành công" });
    } catch (err) {
      res.send({ status: 409, msg: "invalid_data" });
    }
  } else res.send({ status: 409, msg: "invalid_data" });
};
const unique = (arr) => [...new Set(arr)];
exports.login = async (req, res) => {
  const ipcl = req.body.ip
  const data = req.body;
  if (!!data && !!data.username && !!data.password) {
    const user = await User.findOne({ username: data.username });
    if (!user)
      return res.send({ status: 401, msg: "Không tìm thấy tên đăng nhập" });
    if (user?.is_blocking)
      return res.send({ status: 401, msg: "Tài khoản đã bị khóa" });
    const isPasswordValid = bcrypt.compareSync(data.password, user.password);
    if (!isPasswordValid) {
      return res.send({ status: 401, msg: "Mật khẩu không đúng" });
    }
    const accessTokenLife =
      process.env.ACCESS_TOKEN_LIFE || jwtVariable.accessTokenLife;
    const accessTokenSecret =
      process.env.ACCESS_TOKEN_SECRET || jwtVariable.accessTokenSecret;

    const dataForAccessToken = {
      _id: user._id,
      username: user.username,
    };
    const accessToken = await authMethod.generateToken(
      dataForAccessToken,
      accessTokenSecret,
      accessTokenLife
    );
    if (!accessToken)
      res.send({ status: 401, msg: "Đăng nhập không thành công" });
    let refreshToken = randToken.generate(jwtVariable.refreshTokenSize);
    if (!user.refresh_token) {
      user.refresh_token = refreshToken;
    } else {
      refreshToken = user.refresh_token;
    }

    const ip = await getNetworkIP();
    // if(ip != '13.229.66.199') user.ips.push(ip)
    // if(!!ipcl) user.ips.push(ipcl)
    // user.ips = unique(user.ips)
    console.log("ip",ipcl);

    user.last_login = new Date();
    await user.save();
    return res.send({
      msg: "Đăng nhập thành công",
      accessToken,
      refreshToken,
      user: userObj(user),
    });
  } else res.send({ status: 409, msg: "invalid_data" });
};
exports.updateOnline = async (data) => {
  const accessTokenSecret =
    process.env.ACCESS_TOKEN_SECRET || jwtVariable.accessTokenSecret;
  const accessTokenLife =
    process.env.ACCESS_TOKEN_LIFE || jwtVariable.accessTokenLife;

  const decoded = await authMethod.decodeToken(
    data.token,
    accessTokenSecret,
    accessTokenLife
  );
  if (!decoded) {
    return reqHelper(req, res, { status: 400, msg: "token_not_valid" });
  }
  const user = await User.findOne({ username: decoded.payload.username });
  if (user) {
    try {
      user.is_online = data.status;
      await user.save();
    } catch (err) {
      console.log(err);
    }
  }
};
exports.login_to_admin = async (req, res) => {
  const data = req.body;
  if (!!data && !!data.username && !!data.password) {
    const user = await User.findOne({ username: data.username });
    if (!user)
      return res.send({ status: 401, msg: "Không tìm thấy tên đăng nhập" });
    if (user?.is_blocking)
      return res.send({ status: 401, msg: "Tài khoản bị khóa" });
    const isPasswordValid = bcrypt.compareSync(data.password, user.password);
    if (!isPasswordValid) {
      return res.send({ status: 401, msg: "Mật khẩu không đúng" });
    }
    const accessTokenLife =
      process.env.ACCESS_TOKEN_LIFE || jwtVariable.accessTokenLife;
    const accessTokenSecret =
      process.env.ACCESS_TOKEN_SECRET || jwtVariable.accessTokenSecret;

    const dataForAccessToken = {
      username: user.username,
    };
    const accessToken = await authMethod.generateToken(
      dataForAccessToken,
      accessTokenSecret,
      accessTokenLife
    );
    if (!accessToken) res.send({ status: 401, msg: "login_not_success" });
    if (user.role === roles.ADMIN) {
      let refreshToken = randToken.generate(jwtVariable.refreshTokenSize);
      if (!user.refresh_token) {
        user.refresh_token = refreshToken;
        await user.save();
      } else {
        refreshToken = user.refresh_token;
      }
      user.last_login = new Date();
      await user.save();
      const usr = {
        username: user.username,
        email: user.email,
        phone_number: user.phone_number,
        name: user.name,
      };
      return res.send({
        msg: "login_success",
        accessToken,
        refreshToken,
        user: usr,
      });
    }
    res.send({ status: 401, msg: "login_not_success" });
  } else res.send({ status: 409, msg: "invalid_data" });
};
exports.changePassword = async (req, res) => {
  const data = req.body;
  let user = req.user;
  if (!!data && !!data.old_password && !!data.new_password) {
    const isPasswordValid = bcrypt.compareSync(
      data.old_password,
      user.password
    );
    if (!isPasswordValid) {
      return res.send({ status: 409, msg: "Mật khẩu không đúng" });
    } else {
      user.password = bcrypt.hashSync(data.new_password, SALT_ROUND); //SET NEW PASSWORD
      await user.save();
      return res.send({ msg: "Đổi mật khẩu thành công" });
    }
  } else {
    res.send({ status: 409, msg: "invalid_data" });
  }
};
exports.refreshToken = async (req, res) => {
  // Lấy access token từ header
  const accessTokenFromHeader = req
    .header("Authorization")
    ?.replace("Bearer ", "");
  if (!accessTokenFromHeader) {
    return reqHelper(req, res, { status: 400, msg: "token_not_found" });
  }

  // Lấy refresh token từ body
  const refreshTokenFromBody = req.body.refreshToken;
  if (!refreshTokenFromBody) {
    return reqHelper(req, res, { status: 400, msg: "refresh_token_not_found" });
  }

  const accessTokenSecret =
    process.env.ACCESS_TOKEN_SECRET || jwtVariable.accessTokenSecret;
  const accessTokenLife =
    process.env.ACCESS_TOKEN_LIFE || jwtVariable.accessTokenLife;

  // Decode access token đó
  const decoded = await authMethod.decodeToken(
    accessTokenFromHeader,
    accessTokenSecret
  );
  if (!decoded) {
    return reqHelper(req, res, { status: 400, msg: "token_not_valid" });
  }

  const username = decoded.payload.username; // Lấy username từ payload

  const user = await User.findOne({ username: username });
  if (!user) {
    return reqHelper(req, res, { status: 400, msg: "user_notfound" });
  }

  if (refreshTokenFromBody !== user.refresh_token) {
    return reqHelper(req, res, { status: 400, msg: "refresh_token_not_valid" });
  }

  // Tạo access token mới
  const dataForAccessToken = {
    _id,
    username,
  };

  const accessToken = await authMethod.generateToken(
    dataForAccessToken,
    accessTokenSecret,
    accessTokenLife
  );
  if (!accessToken) {
    return reqHelper(req, res, {
      status: 400,
      msg: "create_token_not_success",
    });
  }
  return reqHelper(req, res, { msg: "ok", accessToken });
};
exports.myInfo = async (req, res) => {
  // Lấy access token từ header
  const accessTokenFromHeader =
    req.header("Authorization")?.replace("Bearer ", "") || "";

  const accessTokenSecret =
    process.env.ACCESS_TOKEN_SECRET || jwtVariable.accessTokenSecret;
  const accessTokenLife =
    process.env.ACCESS_TOKEN_LIFE || jwtVariable.accessTokenLife;

  try {
    // Decode access token đó
    const decoded = await authMethod.decodeToken(
      accessTokenFromHeader,
      accessTokenSecret
    );
    const _id = decoded.payload._id; // Lấy id từ payload

    const user = await User.findById({ _id: _id });
    if (!user) {
      return reqHelper(req, res, { status: 400, msg: "user_notfound" });
    }

    return res.send({ user: resUser(user) });
  } catch (error) {
    return reqHelper(req, res, { status: 400, msg: "token_not_valid" });
  }
};
exports.getUser = async (req, res) => {
  const { phone } = req.query;

  // Lấy access token từ header
  const accessTokenFromHeader =
    req.header("Authorization")?.replace("Bearer ", "") || "";
  const accessTokenSecret =
    process.env.ACCESS_TOKEN_SECRET || jwtVariable.accessTokenSecret;
  try {
    // Decode access token đó
    const decoded = await authMethod.decodeToken(
      accessTokenFromHeader,
      accessTokenSecret
    );
    const _id = decoded.payload._id; // Lấy id từ payload
    let query = {};
    if (phone) {
      query.phone_number = { $regex: phone, $options: "i" };
    }
    query._id = { $ne: _id };
    const user = await User.find(query).select("_id name email phone_number avatar cover nickname").lean();
    
    return res.send({ user: user });
  } catch (error) {
    return reqHelper(req, res, { status: 400, msg: "token_not_valid" });
  }
};
