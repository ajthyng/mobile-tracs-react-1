/**
 * Copyright 2017 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const { Response, Headers, Request } = require('whatwg-fetch');

const ActualResponse = Response;

function ResponseWrapper(body, init) {
	if (
		typeof body.constructor === 'function' &&
		body.constructor.__isFallback
	) {
		const response = new ActualResponse(null, init);
		response.body = body;

		const actualClone = response.clone;
		response.clone = () => {
			const clone = actualClone.call(response);
			const [body1, body2] = body.tee();
			response.body = body1;
			clone.body = body2;
			return clone;
		};

		return response;
	}

	return new ActualResponse(body, init);
}

const fetch = jest.fn();
fetch.Headers = Headers;
fetch.Response = ResponseWrapper;
fetch.Request = Request;
fetch.mockResponse = (body, init) => {
	return fetch.mockImplementation(
		() => Promise.resolve(new ResponseWrapper(body, init))
	);
};

fetch.mockReject = () => {
	return fetch.mockImplementation(
		() => Promise.reject()
	);
};

fetch.mockResponseOnce = (body, init) => {
	return fetch.mockImplementationOnce(
		() => Promise.resolve(new ResponseWrapper(body, init))
	);
};


fetch.mockRejectOnce = () => {
	return fetch.mockImplementationOnce(
		() => Promise.reject()
	);
};

fetch.mockResponses = (...responses) => {
	return responses.map(([ body, init ]) => {
		return fetch.mockImplementationOnce(
			() => Promise.resolve(new ResponseWrapper(body, init))
		);
	})
};

fetch.resetMocks = () => {
	fetch.mockReset();
};

// Default mock is just a empty string.
fetch.mockResponse('');

module.exports = fetch;