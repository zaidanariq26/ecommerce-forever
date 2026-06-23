import { Resend } from 'resend';
import { verificationEmailTemplate } from '../templates/emails/verificationEmail.js';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email, token) => {
	const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
	const html = verificationEmailTemplate(verifyUrl);

	try {
		const { data, error } = await resend.emails.send({
			from: 'Forever Store <onboarding@resend.dev>',
			to: email,
			subject: 'Verify your email',
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
