import React, {Component} from 'react'
import styled from 'styled-components'

const Container = styled.View`
  flex-direction: row;
  height: 100px;
  align-items: flex-start;
  background-color: transparent;
  width: 100%;
`

const GradeItemAverageContainer = styled.View`
	width: 100px;
	height: 100px;
	align-items: center;
	justify-content: flex-start;
`

const GradeItemPointsContainer = styled.View`
	align-items: center;
	justify-content: flex-start;
`

const GradeItemEarned = styled.Text`
	font-size: 24px;
	color: #363534;
`

const GradeItemTotal = styled.Text`
	font-size: 14px;
	color: #363534;
`

const QuotientLine = styled.View`
	width: 40px;
	height: 2px;
	background-color: lightgray;
`

const GradeItemInfoContainer = styled.View`
	flex: 1;
	align-items: flex-start;
	justify-content: center;
`

const GradeItemName = styled.Text`
	font-size: 24px;
	color: #363534;
`

const GradeItemPostDate = styled.Text`
	font-size: 20px;
	color: #363534;
`

const GradeItemComments = styled.Text`
	font-size: 20px;
	color: #363534;
`

const GradeItemDueDate = styled.Text`
	font-size: 16px;
	color: #363534;
	text-align: center;
`

const renderAvgOrDueDate = (data) => {
	let {earned, total, due} = data;
	if (earned === null) {
		return (
			<GradeItemDueDate>
				{`Due\n`}{due}
			</GradeItemDueDate>
		)
	} else {
		return (
			<GradeItemPointsContainer>
				<GradeItemEarned>{earned.toString(10)}</GradeItemEarned>
				<QuotientLine />
				<GradeItemTotal>{total.toString(10)}</GradeItemTotal>
			</GradeItemPointsContainer>
		)
	}
}

class GradebookItemRow extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		const {earned, total, name, posted} = this.props.data
		console.log(this.props)
		return (
			<Container>
				<GradeItemAverageContainer>
					{renderAvgOrDueDate(this.props.data)}
				</GradeItemAverageContainer>
				<GradeItemInfoContainer>
					<GradeItemName>{name}</GradeItemName>
					<GradeItemPostDate>Posted: {posted}</GradeItemPostDate>
					<GradeItemComments>Comments</GradeItemComments>
				</GradeItemInfoContainer>
			</Container>
		)
	}
}

GradebookItemRow.defaultProps = {
	data: {
		earned: 0,
		total: 1,
		name: 'Gradebook Item Not Found',
		posted: 'No Grade Posted'
	}
}

export default GradebookItemRow