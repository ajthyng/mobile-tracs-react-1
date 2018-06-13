import React, {Component} from 'react'
import styled from 'styled-components'

const Container = styled.View`
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 20px;
  background-color: white;
  border-top-color: #36353480;
  border-bottom-color: #36353480;
  border-top-width: 1px;
  border-bottom-width: 1px;
`

const Handle = styled.View`
	width: 80px;
	height: 10px;
	border-radius: 8px;
	background-color: lightgray;
`

class PullHandle extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<Container>
				<Handle />
			</Container>
		)
	}
}

export default PullHandle