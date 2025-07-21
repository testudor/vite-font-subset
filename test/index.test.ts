import { describe, expect, it } from 'vitest';
import { getPathAndParam, getSubsetHash } from '../src/index';

describe('getPathAndParam', () => {
	it('should return path and subset for valid CSS file with subset param', () => {
		const id = '/path/to/styles.css?subset=abc123';
		const result = getPathAndParam(id);

		expect(result).toEqual({
			path: '/path/to/styles.css',
			subset: 'abc123'
		});
	});

	it('should return null for CSS file without subset param', () => {
		const id = '/path/to/styles.css';
		const result = getPathAndParam(id);

		expect(result).toBeNull();
	});

	it('should return null for non-CSS file with subset param', () => {
		const id = '/path/to/script.js?subset=abc123';
		const result = getPathAndParam(id);

		expect(result).toBeNull();
	});

	it('should return empty string for subset when subset param has no value', () => {
		const id = '/path/to/styles.css?subset=';
		const result = getPathAndParam(id);

		expect(result).toEqual({
			path: '/path/to/styles.css',
			subset: ''
		});
	});

	it('should handle multiple query parameters', () => {
		const id = '/path/to/styles.css?foo=bar&subset=xyz789&baz=qux';
		const result = getPathAndParam(id);

		expect(result).toEqual({
			path: '/path/to/styles.css',
			subset: 'xyz789'
		});
	});

	it('should return null for invalid URLs', () => {
		const id = 'not-a-valid-url';
		const result = getPathAndParam(id);

		expect(result).toBeNull();
	});

	it('should handle encoded subset values', () => {
		const id = '/path/to/styles.css?subset=Hello%20World';
		const result = getPathAndParam(id);

		expect(result).toEqual({
			path: '/path/to/styles.css',
			subset: 'Hello World'
		});
	});
});

describe('getSubsetHash', () => {
	it('should return a hash for a given subset string', () => {
		const hash = getSubsetHash("abc123");

		expect(typeof hash).toBe('string');
		expect(hash.length).toBeGreaterThan(0);
	});

	it('should return the same hash for the same subset string', () => {
		const hash1 = getSubsetHash("abc123");
		const hash2 = getSubsetHash("abc123");

		expect(hash1).toBe(hash2);
	});

	it('should return the same hash for different permutations of the same characters', () => {
		const hash1 = getSubsetHash('abc123');
		const hash2 = getSubsetHash('321cba');

		expect(hash1).toBe(hash2);
	});

	it('should return different hashes for different subset strings', () => {
		const hash1 = getSubsetHash('abc123');
		const hash2 = getSubsetHash('xyz789');

		expect(hash1).not.toBe(hash2);
	});
});