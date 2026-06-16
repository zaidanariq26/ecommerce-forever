import js from '@eslint/js';
import globals from 'globals';
import json from '@eslint/json';
import { defineConfig } from 'eslint/config';

export default defineConfig([
	{
		files: ['**/*.{js,mjs,cjs}'],
		plugins: { js },
		extends: ['js/recommended'],
		languageOptions: { globals: globals.node },
		rules: {
			'no-unused-vars': [
				'warn',
				{
					vars: 'all',
					args: 'none',
					ignoreRestSiblings: true
				}
			],

			'no-undef': 'error'
		}
	},
	{
		ignores: ['node_modules/**', 'package-lock.json']
	},
	{
		files: ['**/*.json'],
		plugins: { json },
		language: 'json/json',
		extends: ['json/recommended']
	}
]);

