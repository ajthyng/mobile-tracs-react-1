/**
 * Copyright 2017 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {ActionConst, Router, Scene} from 'react-native-router-flux';
import configureStore from './store/configureStore';
import LoginScreen from './components/Login/LoginScreen';
import CourseList from './components/SiteList/SiteList';
import PushNotification from 'react-native-push-notification';
import {token} from './utils/storage';

const store = configureStore();

class App extends Component {
	constructor(props) {
		super(props);
		PushNotification.configure({
			onRegister: function (deviceToken) {
				token.store(deviceToken.token).then(() => {
					console.log("TOKEN: ", deviceToken);
				});
			},
			onNotification: (notification) => {
				console.log("NOTIFICATION: ", notification);
			},
			permissions: {
				alert: true,
				badge: true,
				sound: true,
			},
			popInitialNotification: true,
			requestPermissions: true,
		});
	}

	render() {

		return (
			<Provider store={store}>
				<Router>
					<Scene key="root">
						<Scene key="login"
									 component={LoginScreen}
									 title="TRACS Mobile Login"
									 initial
						/>
						<Scene key="sites"
									 init={true}
									 component={CourseList}
									 type={ActionConst.RESET}
									 title="Sites"
						/>
					</Scene>
				</Router>
			</Provider>
		);
	}
}

export default App;