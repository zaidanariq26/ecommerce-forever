import { Resend } from 'resend';
import { verificationEmailTemplate } from '../templates/emails/verificationEmail.js';
import { resetPasswordTemplate } from '../templates/emails/resetPassword.js';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email, token) => {
	const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
	const html = verificationEmailTemplate(verifyUrl);

	try {
		const { data, error } = await resend.emails.send({
			from: 'Forever Store <onboarding@resend.dev>',
			to: email,
			subject: 'Verify Your Email',
			html
		});

		if (error) {
			console.error('Resend error:', error);
			throw new Error('Failed to send verification email');
		}

		return data;
	} catch (error) {
		console.error('sendVerificationEmail error:', error);
		throw error;
	}
};

export const sendResetPasswordEmail = async (email, token) => {
	const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
	const html = resetPasswordTemplate(resetUrl);

	try {
		const { data, error } = await resend.emails.send({
			from: 'Forever Store <onboarding@resend.dev>',
			to: email,
			subject: 'Reset Your Password',
			html
		});

		if (error) {
			console.error('Resend error:', error);
			throw new Error('Failed to send reset password email');
		}

		return data;
	} catch (error) {
		console.error('sendResetPasswordEmail error:', error);
		throw error;
	}
};
