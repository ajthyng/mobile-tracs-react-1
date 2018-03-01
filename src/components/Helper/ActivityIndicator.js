import React, {Component} from 'react';
import {Animated, Easing, Image, StyleSheet, View} from 'react-native';

const tracsLogo = require('../../../img/tracs.png');

class ActivityIndicator extends Component {
	constructor(props) {
		super(props);
		this.getStyle = this.getStyle.bind(this);
		this.rotateValue = new Animated.Value(0);
		this.rotateImage = this.rotateImage.bind(this);
	}

	rotateImage() {
		Animated.timing(this.rotateValue, {
			toValue: 1,
			duration: this.props.duration || 2500,
			easing: Easing.linear,
			useNativeDriver: true
		}).start(() => {
			this.rotateImage();
		});
	}

	getStyle() {
		const rotateData = this.rotateValue.interpolate({
			inputRange: [0, 1],
			outputRange: ['0deg', '360deg']
		});
		const aspectRatio = 1438 / 1378;
		const imageSize = this.props.size || 80;
		return StyleSheet.create({
			container: {
				flex: 1,
				alignItems: 'center',
				justifyContent: 'center',
			},
			image: {
				width: imageSize * aspectRatio,
				height: imageSize,
				display: 'flex',
			},
			animatedView: {
				width: imageSize * aspectRatio,
				height: (imageSize + imageSize / (22.875)) * aspectRatio,
				transform: [{rotate: rotateData}],
				alignItems: 'center',
				justifyContent: 'flex-end',
			}
		});
	}

	componentDidMount() {
		this.rotateImage();
	}

	render() {
		return (
			<View style={this.getStyle().container}>
				<Animated.View style={this.getStyle().animatedView}>
					<Image style={this.getStyle().image}
								 source={tracsLogo} />
				</Animated.View>
			</View>
		)
	}
}

export default ActivityIndicator;