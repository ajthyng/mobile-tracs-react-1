/**
 * Copyright 2018 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */


import {headerActions} from '../constants/actions';
import {Animated} from 'react-native';
const {SET_SCROLL_Y, SET_HEADER_STATE} = headerActions;

const initialState = {
	scrollY: new Animated.Value(0),
	isCollapsed: false
};

const setScrollY = (state, action) => {
	return {
		...state,
		scrollY: action.scrollY
	}
};

const setHeaderState = (state, action) => {
	return {
		...state,
		isCollapsed: action.isCollapsed
	}
};

export function headerReducer(state = initialState, action) {
	switch(action.type) {
		case SET_SCROLL_Y: return setScrollY(state, action);
		case SET_HEADER_STATE: return setHeaderState(state, action);
		default: return state;
	}
}