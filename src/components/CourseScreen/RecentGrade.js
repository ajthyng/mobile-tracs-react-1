import React, {Component} from 'react';
import styled from 'styled-components';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ripple from 'react-native-material-ripple';

const Container = styled(Ripple)`
  flex: 1;
  margin: 8px 4px 4px 4px;
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

const CommentContainer = styled.View`
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

function getHue(grade) {
	const normalizedGrade = 1 -(100 - (grade < 60 ? 60 : grade)) / 40;
	return normalizedGrade * 120;
}

class RecentGrade extends Component {
	constructor(props) {
		super(props);
		this.hue = getHue(props.grade);
	}

	render() {
		return (
			<Container>
				<GradeCircle gradeColor={`hsl(${this.hue}, 70%, 50%)`}>
					<GradeValue>{this.props.grade}</GradeValue>
				</GradeCircle>
				<GradeInfo>
					<GradeName>
						{this.props.name}
					</GradeName>
					<GradeEntryDate>
						{`Posted: ${this.props.dateGraded}`}
					</GradeEntryDate>
					<CommentContainer>
						<CommentText>Comments</CommentText>
						<CommentButton name="comment"/>
					</CommentContainer>
				</GradeInfo>
			</Container>
		);
	}
}

RecentGrade.defaultProps = {
	name: "Gradebook Name Not Found",
	grade: Math.ceil(Math.random() * 100),
	dateGraded: moment().format('MMM D h:mm a')
};

export default RecentGrade;