/**
 * Copyright 2018 Andrew Thyng
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React from 'react';
import LoginScreen from '../components/Login/LoginScreen';
import * as scenes from '../constants/scenes';
import NotificationSettings from '../components/NotificationSettings/NotificationSettings';
import AboutView from '../components/About/AboutView';
import NotificationView from '../components/Notifications/NotificationView';
import Settings from '../components/Settings/Settings';
import {tabBar} from '../constants/colors';
import SimpleWebView from '../components/SimpleWebView/SimpleWebView';
import {setCurrentScene} from '../actions/routes';
import SiteList from '../components/SiteList/SiteList';
import * as TabIcons from '../components/TabBar/TabIcons';
import TRACSWebView from '../components/TRACSWebView/TRACSWebNative';
import {Actions, Scene, Tabs, Stack, ActionConst} from 'react-native-router-flux';
import {LeftButton} from 'react-native-router-flux/dist/NavBar';
import Icon from 'react-native-vector-icons/Ionicons';
import {View} from 'react-native';
import NavBar from '../components/NavigationBar/NavBar';

Scenes = function (store) {
	return Actions.create(
		<Scene key="root">
			<Scene key={scenes.login}
						 component={LoginScreen}
						 title="TRACS Mobile Login"
						 initial={true}
						 hideNavBar={true}
						 onEnter={() => {
							 store.dispatch(setCurrentScene(scenes.login));
						 }}
						 type={ActionConst.RESET}/>
			<Tabs key={scenes.main}
						type={ActionConst.RESET}
						activeTintColor={tabBar.active}
						inactiveTintColor={tabBar.inactive}
						tabBarStyle={{backgroundColor: tabBar.backgroundColor}}
						hideNavBar
						swipeEnabled={false}
						backToInitial
						lazy={true}
						showLabel={true}
						labelStyle={{marginBottom: 5}}
						tabBarPosition="bottom">
				<Stack key={scenes.announcementsTab}
							 icon={TabIcons.announcements}
							 navigationBarStyle={{backgroundColor: "#501214"}}
							 navBarButtonColor="#fff"
							 titleStyle={{color: "#fff"}}
							 tabBarLabel="Announcements">
					<Scene key={scenes.announcements}
								 icon={TabIcons.announcements}
								 initial
								 tabBarLabel="Announcements"
								 title="Announcements"
								 hideNavBar={false}
								 component={NotificationView}
								 onEnter={(props) => {
									 store.dispatch(setCurrentScene(scenes.announcements));
									 props.renderAnnouncements = true;
									 return props;
								 }}/>
					<Scene key={scenes.tracsAnnouncement}
								 component={TRACSWebView}
								 hideNavBar={global.android}
								 navBar={(props) => {
								 	return (<NavBar {...props} title="TRACS"/>);
								 }}
								 onEnter={() => {
									 store.dispatch(setCurrentScene(scenes.tracsAnnouncement));
								 }}/>
				</Stack>
				<Stack key={scenes.sitesTab}
							 icon={TabIcons.sites}
							 initial
							 navigationBarStyle={{backgroundColor: "#501214"}}
							 navBarButtonColor="#fff"
							 titleStyle={{color: "#fff"}}
							 tabBarLabel="All Sites">
					<Scene
						key={scenes.sites}
						title="TRACS"
						component={SiteList}
						initial
						hideNavBar={false}
						onEnter={() => {
							store.dispatch(setCurrentScene(scenes.sites));
						}}/>
					<Scene key={scenes.dashboard}
								 title="Dashboard"
								 swipeEnabled={false}
								 component={NotificationView}
								 onEnter={() => {
									 store.dispatch(setCurrentScene(scenes.dashboard));
								 }}/>
					<Scene key={scenes.tracsDashboard}
								 component={TRACSWebView}
								 hideNavBar={global.android}
								 navBar={(props) => {
								 	return (<NavBar {...props} title="TRACS"/>);
								 }}
								 onEnter={() => {
									 store.dispatch(setCurrentScene(scenes.tracsDashboard));
								 }}
					/>
				</Stack>
				<Stack key={scenes.settingsTab}
							 icon={TabIcons.settings}
							 navigationBarStyle={{backgroundColor: "#501214"}}
							 navBarButtonColor="#fff"
							 titleStyle={{color: "#fff"}}
							 tabBarLabel="Settings">
					<Scene key={scenes.settings}
								 initial
								 title="Settings"
								 hideNavBar={false}
								 component={Settings}
								 onEnter={() => {
									 store.dispatch(setCurrentScene(scenes.settings));
								 }}/>
					<Scene key={scenes.notificationSettings}
								 back
								 title="Notification Settings"
								 component={NotificationSettings}
								 onEnter={() => {
									 store.dispatch(setCurrentScene(scenes.notificationSettings));
								 }}/>
					<Scene key={scenes.feedback}
								 back
								 title="Feedback"
								 component={SimpleWebView}
								 url={global.urls.feedback}
								 onEnter={() => {
									 store.dispatch(setCurrentScene(scenes.feedback));
								 }}/>
					<Scene key={scenes.support}
								 back
								 title="TRACS Support"
								 component={SimpleWebView}
								 url={global.urls.support}
								 onEnter={() => {
									 store.dispatch(setCurrentScene(scenes.support));
								 }}/>
				</Stack>
			</Tabs>
			<Scene key={scenes.about}
						 hideNavBar={true}
						 back
						 component={AboutView}
						 onEnter={() => {
							 store.dispatch(setCurrentScene(scenes.about));
						 }}/>
		</Scene>
	);
};

module.exports = Scenes;