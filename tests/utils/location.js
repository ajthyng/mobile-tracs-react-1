/**
 * Copyright 2017 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import * as location from '../../src/utils/location';

it('should return false if currentScene is empty', () => {
	const currentScene = '';
	const reduxScene = 'login';

	expect(location.compare(currentScene, reduxScene)).toEqual(false);
});

it('should return false if reduxScene is empty', () => {
	const currentScene = 'login';
	const reduxScene = '';

	expect(location.compare(currentScene, reduxScene)).toEqual(false);
});

it('should return true if both scenes are equal', () => {
	const currentScene = 'login';
	const reduxScene = 'login';

	expect(location.compare(currentScene, reduxScene)).toEqual(true);
});

it('should return false if both scenes are empty', () => {
	const currentScene = '';
	const reduxScene = '';
	expect(location.compare(currentScene, reduxScene)).toEqual(false);
});

it('should return false if currentScene is undefined', () => {
	const currentScene = undefined;
	const reduxScene = 'login';

	expect(location.compare(currentScene, reduxScene)).toEqual(false);
});

it('should return false if reduxScene is undefined', () => {
	const currentScene = 'login';
	const reduxScene = undefined;

	expect(location.compare(currentScene, reduxScene)).toEqual(false);
});

it('should return false if both scenes are undefined', () => {
	const currentScene = undefined;
	const reduxScene = undefined;

	expect(location.compare(currentScene, reduxScene)).toEqual(false);
});

it('should return false if scenes are different', () => {
	const currentScene = 'login';
	const reduxScene = 'sites';

	expect(location.compare(currentScene, reduxScene)).toEqual(false);
});

it ('should return false if scenes are different types', () => {
	const currentScene = 45;
	const reduxScene = 'sites';

	expect(location.compare(currentScene, reduxScene)).toEqual(false);
});
