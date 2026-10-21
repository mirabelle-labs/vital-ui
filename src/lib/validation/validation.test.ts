import { describe, expect, it } from 'vitest';
import {
	required,
	email,
	pattern,
	between,
	dns1123,
	port,
	imageRef,
	compose,
	check,
	minLength,
	oneOf
} from './rules';
import { validateWith } from './schema';

describe('rules', () => {
	it('required rejects empty values only', () => {
		expect(required()('')).toBe('Required.');
		expect(required()('   ')).toBe('Required.');
		expect(required()([])).toBe('Required.');
		expect(required()('x')).toBeUndefined();
		expect(required()(0)).toBeUndefined();
	});

	it('format rules let empty values through', () => {
		expect(email()('')).toBeUndefined();
		expect(email()('nope')).toBe('Enter a valid email address.');
		expect(email()('a@b.co')).toBeUndefined();
		expect(pattern(/^\d+$/, 'digits')('12a')).toBe('digits');
		expect(minLength(3)('ab')).toBe('At least 3 characters.');
	});

	it('numeric rules accept numbers and numeric strings', () => {
		expect(between(1, 10)('11')).toBe('1 to 10.');
		expect(between(1, 10)(5)).toBeUndefined();
		expect(port()('70000')).toBe('1 to 65535.');
		expect(port()(8080)).toBeUndefined();
	});

	it('has domain rules for names and images', () => {
		expect(dns1123()('Checkout')).toBeDefined();
		expect(dns1123()('checkout-api')).toBeUndefined();
		expect(imageRef()('ghcr.io/acme/')).toBeDefined();
		expect(imageRef()('ghcr.io/acme/api:1.2.3')).toBeUndefined();
		expect(oneOf(['a', 'b'])('c')).toBe('Pick one of the options.');
	});

	it('composes rules, first failure wins', () => {
		const confirmation = compose<string, { password: string }>(
			required(),
			check((value, values) => value === values.password, 'Must match.')
		);

		expect(confirmation('', { password: 'x' })).toBe('Required.');
		expect(confirmation('y', { password: 'x' })).toBe('Must match.');
		expect(confirmation('x', { password: 'x' })).toBeUndefined();
	});
});

describe('schema', () => {
	type Deploy = { name: string; zip: string; port: string };

	const validate = validateWith<Deploy>({
		name: [required(), dns1123()],
		zip: required(),
		port: [required(), port()]
	});

	it('reports one error per failing field', () => {
		expect(validate({ name: '', zip: '', port: '' })).toEqual({
			name: 'Required.',
			zip: 'Required.',
			port: 'Required.'
		});
	});

	it('returns an empty object when everything passes', () => {
		expect(validate({ name: 'Bad Name', zip: '75002', port: '99999' })).toEqual({
			name: 'Lowercase letters, digits and dashes.',
			port: '1 to 65535.'
		});
		expect(validate({ name: 'ok', zip: '75002', port: '80' })).toEqual({});
	});
});
