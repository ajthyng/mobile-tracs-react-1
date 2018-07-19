import React, {Component} from 'react'
import {FlatList} from 'react-native'
import styled from 'styled-components'
import {connect} from 'react-redux'
import {getAnnouncements} from '../actions/announcements'

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: tomato;
  width: 100%;
`

class AnnouncementsScreen extends Component {
	constructor(props) {
		super(props)
	}

	componentDidMount () {
		this.props.getAnnouncements()
	}

	render() {
		const {announcements} = this.props
		console.log(announcements)
		return (
			<Container>
				<FlatList

				/>
			</Container>
		)
	}
}

const mapStateToProps = state => ({
	announcements: state.announcements
})

const mapDispatchToProps = dispatch => ({
	getAnnouncements: () => dispatch(getAnnouncements())
})

export default connect(mapStateToProps, mapDispatchToProps)(AnnouncementsScreen)