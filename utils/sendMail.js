const nodemailer = require("nodemailer");

const sendMail = async (email, subject, text) => {
	try {
		const transporter = nodemailer.createTransport({
			// host: "smtp.ethereal.email",
			// port: 587,
			service: 'gmail',
			// secure: false,
			auth: {
				user: "",
				pass: "sscgshemcoteipzd",
			},
		});

		await transporter.sendMail({
			from: "",
			to: email,
			subject: subject,
			text: text,
		});
		console.log("email sent success fully");
	} catch (error) {
		console.log(error, "email not sent");
	}
};

module.exports = sendMail;
