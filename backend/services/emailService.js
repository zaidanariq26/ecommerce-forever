import nodemailer from 'nodemailer';
import { verificationEmailTemplate } from '../templates/emails/verificationEmail.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Logo PNG → Base64
const logoBase64 = fs.readFileSync(join(__dirname, '../assets/logo.png')).toString('base64');
const logoSrc = `data:image/png;base64,${logoBase64}`;

// Ilustrasi SVG
const illustrationSvg = fs
	.readFileSync(join(__dirname, '../assets/email-send.svg'), 'utf8')
	.replace('<svg', '<svg style="width: 180px; height: auto; display: block; margin: 0 auto; padding: 60px 10px;"');

const transporter = nodemailer.createTransport({
	host: process.env.EMAIL_HOST,
	port: process.env.EMAIL_PORT,
	secure: process.env.EMAIL_PORT == 465,
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS
	},
	tls: {
		rejectUnauthorized: process.env.NODE_ENV === 'production'
	}
});

transporter.verify((error) => {
	if (error) {
		console.error('Email transporter error:', error);
	} else {
		console.log('Email transporter ready');
	}
});

const sendVerificationEmail = async (email, firstName, token) => {
	const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

	await transporter.sendMail({
		from: `"Forever Store" <${process.env.EMAIL_FROM}>`,
		to: email,
		subject: 'Verify your email',
		html: verificationEmailTemplate(firstName, verifyUrl, logoSrc, illustrationSvg)
	});
};

export default sendVerificationEmail;
