/**
 * Copyright 2018 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import * as math from 'mathjs';

const rotateX = (deg = 0) => {
	const rad = (Math.PI / 180) * deg;
	const cos = Math.cos(rad);
	const sin = Math.sin(rad);

	return math.matrix([
		[1, 0, 0, 0],
		[0, cos, -sin, 0],
		[0, sin, cos, 0],
		[1, 0, 0, 0]
	]);
};

const transformOrigin = (matrix, origin) => {
	const {x, y, z} = origin;

	const translate = math.matrix([
		[1, 0, 0, 0],
		[0, 1, 0, 0],
		[0, 0, 1, 0],
		[x, y/2, z, 1]
	]);

	const reverseTranslate = math.matrix([
		[1, 0, 0, 0],
		[0, 1, 0, 0],
		[0, 0, 1, 0],
		[-x, -y/2, -z, 1]
	]);

	const translateY = math.multiply(translate, matrix);
	return math.multiply(translateY, reverseTranslate);
};

module.exports = {
	rotateX,
	transformOrigin
};