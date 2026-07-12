import crypto from 'crypto';

const tokenBlocklist = new Set();

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const addToBlocklist = (token) => {
	tokenBlocklist.add(hashToken(token));
};

const isBlocked = (token) => {
	return tokenBlocklist.has(hashToken(token));
};

export { addToBlocklist, isBlocked };
