import React, {Component} from 'react'
import styled from 'styled-components'
import Toggle from '../Toggle'
import {connect} from 'react-redux'
import {setFilter} from '../../actions/sites'

const Container = styled.View`
	height: 40px;
	width: 100%;
	align-items: center;
	justify-content: flex-end;
	padding-right: 8px;
	flex-direction: row;
	background-color: ${props => props.theme.header};
`

const LeftLabel = styled.Text`
	font-size: 12px;
	color: #fff;
`

const RightLabel = styled.Text`
	font-size: 12px;
	color: #fff;
	text-align: center;
`

const setSiteFilter = (on) => {
	const favoritesFilter = (favorites) => (site) => favorites.contains(site.id)
	const noFilter = (favorites) => (site) => true

	return on ? noFilter : favoritesFilter
}

class AdditionalContent extends Component {
	render() {
		const {visible, setFilter} = this.props
		return visible ? (
			<Container>
				<LeftLabel>Favorites</LeftLabel>
				<Toggle width={36} height={16} disabledColor='lightgray' activeColor='dodgerblue' onValueChange={(on) => {
					const siteFilter = setSiteFilter(on)
					setFilter(siteFilter)
				}} />
				<RightLabel>All{'\n'}Sites</RightLabel>
			</Container>
		) : null
	}
}

const mapDispatchToProps = dispatch => ({
	setFilter: (filter) => dispatch(setFilter(filter))
})

export default connect(null, mapDispatchToProps)(AdditionalContent)