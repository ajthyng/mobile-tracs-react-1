import React, {Component} from 'react';
import {connect} from 'react-redux';
import Ripple from 'react-native-material-ripple';
import {View, StyleSheet, Animated} from 'react-native';
import {logout} from '../../actions/login';
import * as Storage from '../../utils/storage';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import CourseList from '../CourseList/CourseList';
import Header from '../CircleHeader/Header';
import {setHeaderState} from '../../actions/header';
import {getSiteInfo, getFavorites} from '../../actions/sites'
import {getGrades} from '../../actions/grades'
import styled from 'styled-components';

const Home = styled.View`
		flex: 1;
		background-color: ${props => props.theme.viewBackground};
		width: 100%;
`

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
	static navigationOptions = {
		title: 'Home'
	}

	constructor (props) {
		super(props);
		this.props.setHeaderState(Header.EXPANDED);
	}

	componentDidUpdate () {
		if (!this.props.authenticated) {
			this.props.navigation.navigate('Login');
		}
	}

	componentDidMount () {
		this.props.getSites(this.props.netid)
		this.props.getGrades()
		this.props.getFavorites()
	}

	render () {
		const { loadingSites, loadingFavorites } = this.props
		return (
			<Home>
				<CourseList loading={loadingSites || loadingFavorites} navigation={this.props.navigation} />
			</Home>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		authenticated: state.login.isAuthenticated,
		netid: state.login.netid,
		loadingSites: state.tracsSites.isFetchingSites,
		loadingFavorites: state.tracsSites.isFetchingFavorites
	}
};

const mapDispatchToProps = (dispatch, props) => {
	return {
		logout: () => {
			Storage.credentials.reset();
			dispatch(logout())
		},
		setHeaderState: (isCollapsed) => {
			if (props.isCollapsed !== isCollapsed) {
				dispatch(setHeaderState(isCollapsed))
			}
		},
		getSites: (netid) => dispatch(getSiteInfo(netid)),
		getGrades: () => dispatch(getGrades()),
		getFavorites: () => dispatch(getFavorites())
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);