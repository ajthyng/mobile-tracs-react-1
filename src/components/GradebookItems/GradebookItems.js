import React, {Component} from 'react'
import styled from 'styled-components'
import ScreenHeader from '../ScreenHeader'
import GradeSummary from '../GradeSummary'
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
				<ScreenHeader navigation={this.props.navigation} title='All Gradebook Items' subtitle='HS 1440 v2018.18.30'/>
				<GradeSummary />
				<GradebookList />
			</Container>
		)
	}
}


export default GradebookItems