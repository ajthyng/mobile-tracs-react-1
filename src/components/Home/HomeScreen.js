import React, {Component} from 'react';
import {connect} from 'react-redux';
import Ripple from 'react-native-material-ripple';
import {View, StyleSheet, Animated} from 'react-native';
import {logout} from '../../actions/login';
import * as Storage from '../../utils/storage';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import CourseList from '../CourseList/CourseList';
import Header from '../Header/Header';
import {setHeaderState} from '../../actions/header';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-around',
		backgroundColor: 'white',
		width: '100%'
	}
});

const LogoutButtonHOC = Comp => ({newRef, children, ...props}) => (
	<Comp
		style={{
			flexDirection: 'row',
			alignContent: 'center',
			justifyContent: 'center',
			backgroundColor: props.backgroundColor || "#1b3c80",
			width: 70,
			height: 70,
			borderRadius: 35,
			position: 'absolute',
			right: 20,
			bottom: 20,
			elevation: 4,
			shadowColor: '#000',
			shadowOffset: {
				width: 0,
				height: 2
			},
			shadowRadius: 3,
			shadowOpacity: 0.7
		}}
		ref={newRef}
		{...props}
	>
		<Icon
			style={{
				color: "#fff",
				fontSize: 25,
				textAlign: 'center',
				alignSelf: 'center',
				marginRight: 7,
				marginTop: 2
			}}
			name="logout"
		/>
	</Comp>
);

const LogoutButton = LogoutButtonHOC(Ripple);

class HomeScreen extends Component {
	constructor(props) {
		super(props);
		this.props.setHeaderState(Header.EXPANDED);
	}

	componentDidUpdate() {
		if (!this.props.authenticated) {
			this.props.navigation.navigate('Login');
		}
	}

	render() {
		return (
			<View style={styles.container}>
				<CourseList />
				<LogoutButton
					onPress={() => this.props.logout()}
				/>
			</View>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		authenticated: state.login.isAuthenticated
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		logout: () => {
			Storage.credentials.reset();
			dispatch(logout())
		},
		setHeaderState: (isCollapsed) => dispatch(setHeaderState(isCollapsed))
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);