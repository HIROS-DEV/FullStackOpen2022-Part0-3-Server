module.exports = {
	env: {
		commonjs: true,
		es2021: true,
		node: true,
	},
	extends: 'eslint:recommended',
	parserOptions: {
		ecmaVersion: 'latest',
	},
	rules: {
		indent: ['error', 'tab'],
		quotes: ['error', 'single'],
		semi: ['error', 'always'],
		eqeqeq: 'error',
		'linebreak-style': ['error', 'unix'],
		'no-trailing-spaces': 'error',
		'object-curly-spacing': ['error', 'always'],
		'arrow-spacing': ['error', { before: true, after: true }],
		'no-console': 0,
	},
};
