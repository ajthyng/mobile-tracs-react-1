import React, {Component} from 'react'
import {TouchableOpacity, Animated, View, Dimensions} from 'react-native'
import Swipeout from 'react-native-swipeout'
import styled from 'styled-components'
import Comments from './Comments'
import dayjs from 'dayjs'
import GradeComment from './GradeComment'

const Container = styled(Animated.View)`
  margin: 8px 4px 16px 4px;
  align-items: flex-start;
  justify-content: center;
  flex-direction: row;
`

const GradeCircle = styled.View`
	height: 60px;
	width: 60px;
	border-radius: 30px;
	background-color: ${props => props.gradeColor};
	align-items: center;
	justify-content: center;
`

const GradeValue = styled.Text`
	color: white;
	font-size: 22px;
	text-align: center;
	font-weight: bold;
`

const GradeInfo = styled.View`
	flex: 1;
	height: 100%;
	background-color: transparent;
	align-content: center;
	justify-content: flex-start;
`

const GradeName = styled.Text`
	padding-left: 8px;
	font-size: 16px;
	color: #363534;
`

const GradeEntryDate = styled.Text`
	padding-left: 8px;
	font-size: 14px;
	color: #363534;
`

function getHue(grade, points) {
	const failingThreshold = 0.6
	const failingPoints = failingThreshold * points
	const remainder = (1 - failingThreshold) * points

	const gradePercent = (points - (grade < failingPoints ? failingPoints : grade)) / remainder

	const normalizedGrade = 1 - gradePercent
	return normalizedGrade * 120
}

class RecentGrade extends Component {
	constructor(props) {
		super(props)
		const {grade, points} = props

		this.driver = new Animated.Value(0)
		this.hue = getHue(parseInt(grade, 10), points)
	}

	showComment = () => {
		this.animateComment(true)
	}

	hideComment = () => {
		this.animateComment(false)
	}

	animateComment = (showComment = true) => {
		Animated.timing(this.driver, {
			toValue: showComment ? 1 : 0,
			duration: 200,
			useNativeDriver: true
		}).start(() => {
			if (showComment) {
				this.comments.flashScrollIndicators()
			}
		})
	}

	render() {
		const {grade, name, comment, dateGraded} = this.props
		const {width} = Dimensions.get('window')

		const translateX = this.driver.interpolate({
			inputRange: [0, 1],
			outputRange: [0, -width]
		})

		const opacity = this.driver.interpolate({
			inputRange: [0, 1],
			outputRange: [1, 1]
		})

		const translateCommentX = this.driver.interpolate({
			inputRange: [0, 1],
			outputRange: [width, 0]
		})

		const commentOpacity = this.driver.interpolate({
			inputRange: [0, 1],
			outputRange: [1, 1]
		})

		return (
			<View style={{backgroundColor: 'white', overflow: 'hidden'}}>
				<Container style={{transform: [{translateX: translateX}], opacity}}>
					<GradeCircle gradeColor={`hsl(${this.hue}, 70%, 50%)`}>
						<GradeValue>{grade}</GradeValue>
					</GradeCircle>
					<GradeInfo>
						<GradeName>
							{name}
						</GradeName>
						<GradeEntryDate>
							{`Posted: ${dayjs(dateGraded).format('MMM DD h:mm a')}`}
						</GradeEntryDate>
						{comment ? <GradeComment onPress={this.showComment} style={{marginTop: 8}} /> : null}
					</GradeInfo>
				</Container>
				<Comments
					ref={c => this.comments = c}
					onPress={this.hideComment}
					comment={comment}
					style={{
						transform: [{translateX: translateCommentX}],
						opacity: commentOpacity,
						position: 'absolute'
					}}
				/>
			</View>
		)
	}
}

RecentGrade.defaultProps = {
	name: "Gradebook Name Not Found",
	grade: Math.ceil(Math.random() * 100),
	dateGraded: dayjs().format('MMM DD HH:mm a')
}

export default RecentGrade