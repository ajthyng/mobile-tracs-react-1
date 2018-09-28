import React, { PureComponent } from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import styled from 'styled-components'
import Icon from 'react-native-vector-icons/FontAwesome'
import { NavigationActions, withNavigation } from 'react-navigation'
import CourseInfo from './CourseInfo'

const CardBoundary = styled.View`
  flex-direction: row;
  background-color: ${props => props.theme.courseCard.background};
  border-radius: 2px;
  margin: 10px;
  border: solid ${props => props.new ? '2' : '0'}px ${props => props.color};
  shadow-color: ${props => props.theme.courseCard.shadow};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.3;
  shadow-radius: 3px;
  elevation: 3;
`

const ColorBar = styled.View`
  width: 10px;
  background-color: ${props => props.color || '#000'};
  border-top-left-radius: ${props => props.new ? '0' : '2'}px;
  border-bottom-left-radius: ${props => props.new ? '0' : '2'}px;
`

const HomeIcon = styled.View`
  align-items: center;
  justify-content: center;
  width: 95px;
  border-right-width: 1px;
  borderRightColor: #80808030;
`

const TitleContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 24px;
`

const Name = styled.Text`
  font-size: 20px;
  line-height: 20px;
  align-self: center;
`

class HomeCard extends PureComponent {
  onPress = () => {
    this.goToWeb()
  }

  goToWeb = () => {
    const { course: { id: siteId }, navigation } = this.props

    const url = `${global.urls.baseUrl}${global.urls.webUrl}/~${siteId}`
    const mainSite = `${global.urls.baseUrl}${global.urls.portal}`
    const openWebView = NavigationActions.navigate({
      routeName: 'TRACSWeb',
      params: { baseUrl: siteId ? url : mainSite, transition: 'cardFromRight' }
    })
    navigation.dispatch(openWebView)
  }

  render () {
    const {
      name,
      color
    } = this.props.course

    return (
      <TouchableWithoutFeedback onPress={this.onPress}>
        <CardBoundary color={color} >
          <ColorBar color={color} />
          <HomeIcon>
            <Icon name='home' color='#501214' size={29} />
          </HomeIcon>
          <TitleContainer>
            <Name numberOfLines={1}>{name}</Name>
          </TitleContainer>
        </CardBoundary>
      </TouchableWithoutFeedback>
    )
  }
}

HomeCard.defaultProps = {
  course: {
    color: '#808080',
    name: 'TRACS Home'
  }
}

export default withNavigation(HomeCard)
