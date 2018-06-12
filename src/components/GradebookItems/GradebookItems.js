import React, {Component} from 'react'
import styled from 'styled-components'
import GradebookHeader from './GradebookHeader'
import GradeSummary from './GradeSummary'
import GradebookList from './GradebookList'

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: white;
`


class GradebookItems extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<Container>
				<GradebookHeader />
				<GradeSummary />
				<GradebookList />
			</Container>
		)
	}
}


export default GradebookItems