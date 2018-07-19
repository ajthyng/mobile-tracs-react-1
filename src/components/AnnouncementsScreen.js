import React, {Component} from 'react'
import {FlatList} from 'react-native'
import styled from 'styled-components'
import {connect} from 'react-redux'

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 100%;
`

class AnnouncementsScreen extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<Container>
				<FlatList />
			</Container>
		)
	}
}

const mapStateToProps = state => ({
	announcements: state.announcements
})

export default connect(mapStateToProps, null)(AnnouncementsScreen)