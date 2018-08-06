/**
 * Copyright 2018 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const isNavigationBetweenScenes = (to, from, targetOne, targetTwo) => {
	const destinations = [targetOne, targetTwo];
	return destinations.contains(to) && destinations.contains(from);
};

export const cardFromRight = (sceneProps) => {
	const {layout, position, scene} = sceneProps;
	const {index} = scene;

	const width = layout.initWidth;
	const translateX = position.interpolate({
		inputRange: [index - 1, index, index + 1],
		outputRange: [width, 0, 0]
	});

	const opacity = position.interpolate({
		inputRange: [index - 1, index, index + 1],
		outputRange: [0.5, 1, 0.5]
	})

	return {transform: [{translateX}]};
};

export const cardFromLeft = (sceneProps) => {
	const {layout, position, scene} = sceneProps;
	const {index} = scene;

	const width = layout.initWidth;

	const translateX = position.interpolate({
		inputRange: [index - 1, index, index + 1],
		outputRange: [-width, 0, 0]
	});

	return {transform: [{translateX}]};
};
export const cardFromTop = (sceneProps) => {
	const {layout, position, scene} = sceneProps;
	const {index} = scene;

	const height = layout.initHeight;

	const translateY = position.interpolate({
		inputRange: [index - 1, index, index + 1],
		outputRange: [-height, 0, 0]
	});

	const opacity = position.interpolate({
		inputRange: [index - 1, index, index + 0.99, index + 1],
		outputRange: [1, 1, 0.3, 0]
	});


	return {opacity, transform: [{translateY}]};
};

export const cardFromBottom = (sceneProps) => {
	const {layout, position, scene} = sceneProps;
	const {index} = scene;

	const height = layout.initHeight;

	const translateY = position.interpolate({
		inputRange: [index - 1, index, index + 1],
		outputRange: [height, 0, 0]
	});

	const opacity = position.interpolate({
		inputRange: [index - 1, index, index + 0.99, index + 1],
		outputRange: [1, 1, 0.3, 0]
	});


	return {opacity, transform: [{translateY}]};
};

export const defaultTransition = (sceneProps) => {
	const {scene: {index}, position} = sceneProps;
	const inputRange = [index - 1, index, index + 1];
	const outputRange = [.8, 1, 1];

	const opacity = position.interpolate({
		inputRange,
		outputRange,
	});

	const scaleY = position.interpolate({
		inputRange,
		outputRange,
	});

	return {}
};