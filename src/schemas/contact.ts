import { checkSchema } from 'express-validator';

const contactSchema = checkSchema({
	nonce: {
		in: 'body',
		exists: true,
		notEmpty: {
			options: {
				ignore_whitespace: true,
			},
		},
		isUUID: {
			options: '4',
		},
	},
	name: {
		in: 'body',
		exists: {
			errorMessage: 'Please provide your name',
		},
		notEmpty: {
			options: {
				ignore_whitespace: true,
			},
			errorMessage: 'Please provide your name',
		},
		isString: true,
		trim: true,
		escape: true,
	},
	email: {
		in: 'body',
		exists: true,
		notEmpty: {
			options: {
				ignore_whitespace: true,
			},
			errorMessage: 'Please provide your email address',
		},
		isEmail: {
			errorMessage: 'Incorrect email formate',
		},
		normalizeEmail: {
			options: {
				all_lowercase: true,
			},
		},
	},
	phoneNumber: {
		in: 'body',
		optional: {
			options: {
				checkFalsy: true,
			},
		},
		isMobilePhone: {
			options: 'en-GB',
			errorMessage: 'Please provide a valid UK mobile phone number',
		},
		exists: true,
		trim: true,
		escape: true,
	},
	webDevelopment: {
		in: 'body',
		optional: {
			options: {
				checkFalsy: true,
			},
		},
		exists: true,
		isString: true,
		trim: true,
		escape: true,
	},
	webHosting: {
		in: 'body',
		optional: {
			options: {
				checkFalsy: true,
			},
		},
		exists: true,
		isString: true,
		trim: true,
		escape: true,
	},
	message: {
		in: 'body',
		exists: true,
		notEmpty: {
			options: {
				ignore_whitespace: true,
			},
			errorMessage: 'Please provide your message',
		},
		isString: true,
		trim: true,
		escape: true,
	},
});

export default contactSchema;
