import React, {Component} from 'react';
import {TouchableOpacity} from 'react-native'
import styled from 'styled-components';
import Icon from 'react-native-vector-icons/FontAwesome';
import dayjs from 'dayjs'

const Container = styled.View`
  margin: 8px 4px 16px 4px;
  align-items: flex-start;
  justify-content: center;
  flex-direction: row;
`;

const GradeCircle = styled.View`
	height: 60px;
	width: 60px;
	border-radius: 30px;
	background-color: ${props => props.gradeColor};
	align-items: center;
	justify-content: center;
`;

const GradeValue = styled.Text`
	color: white;
	font-size: 22px;
	text-align: center;
	font-weight: bold;
`;

const GradeInfo = styled.View`
	flex: 1;
	height: 100%;
	background-color: transparent;
	align-content: center;
	justify-content: flex-start;
`;

const GradeName = styled.Text`
	padding-left: 8px;
	font-size: 16px;
	color: #363534;
`;

const GradeEntryDate = styled.Text`
	padding-left: 8px;
	font-size: 14px;
	color: #363534;
`;

const CommentContainer = styled(TouchableOpacity)`
	padding: 0 0 8px 8px;
	background-color: transparent;
	flex-direction: row;
	align-items: flex-end;
	justify-content: flex-end;
	flex: 1;
`;

const CommentButton = styled(Icon)`
	font-size: 18px;
	color: #363534;
	padding-left: 8px;
`;

const CommentText = styled.Text`
	font-size: 14px;
	color: #363534;
`;

function getHue(grade, points) {
	const failingThreshold = 0.6
	const failingPoints = failingThreshold * points
	const remainder = (1 - failingThreshold) * points

	const gradePercent = (points - (grade < failingPoints ? failingPoints : grade)) / remainder

	const normalizedGrade = 1 - gradePercent
	return normalizedGrade * 120
}

const commentsContainer = () => (
	<CommentContainer>
		<CommentText>Comments</CommentText>
		<CommentButton name="comment"/>
	</CommentContainer>
)

class RecentGrade extends Component {
	constructor(props) {
		super(props);
		const {grade, points} = props

		this.hue = getHue(parseInt(grade, 10), points);
	}

	render() {
		const {grade, name, comment, dateGraded} = this.props

		return (
			<Container>
				<GradeCircle gradeColor={`hsl(${this.hue}, 70%, 50%)`}>
					<GradeValue>{grade}</GradeValue>
				</GradeCircle>
				<GradeInfo>
					<GradeName>
						{name}
					</GradeName>
					<GradeEntryDate>
						{`Posted: ${dayjs(dateGraded).format('MMM DD HH:mm a')}`}
					</GradeEntryDate>
					{comment ? commentsContainer() : null}
				</GradeInfo>
			</Container>
		);
	}
}

RecentGrade.defaultProps = {
	name: "Gradebook Name Not Found",
	grade: Math.ceil(Math.random() * 100),
	dateGraded: dayjs().format('MMM DD HH:mm a')
};

export default RecentGrade;