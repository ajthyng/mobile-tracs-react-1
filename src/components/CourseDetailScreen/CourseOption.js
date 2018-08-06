import React, {Component} from 'react'
import styled, {withTheme} from 'styled-components'
import {Dimensions, Text} from 'react-native'
import {FlatList, TouchableWithoutFeedback, StyleSheet} from 'react-native'
import Ripple from 'react-native-material-ripple'
import Icon from 'react-native-vector-icons/FontAwesome'
import {withNavigation, NavigationActions} from 'react-navigation'

const optionOnPress = (onPress, props) => {
  const {id: siteId} = props.course
  const {navigation} = props

  const url = `${global.urls.baseUrl}${global.urls.webUrl}/${siteId}`

  if (typeof onPress === 'function') onPress(navigation, url)
}

const Container = styled(Ripple)`
  width: ${props => props.square - 10}px;
  height: ${props => props.square - 10}px;
  margin: 3px;
  background-color: white;
  align-items: center;
  justify-content: center;
  
  shadow-color: #363534;
	shadow-opacity: 0.5;
	shadow-offset: 0 1px;
	shadow-radius: 1px;
`

const Label = styled.Text`
  margin-top: 8px;
  font-size: 18px;
  color: ${props => props.theme.darkText};
`

const CourseOption = (props) => {
  const width = Math.floor(Dimensions.get('window').width / 2)
  const {label, name, theme, Icon, onClick} = props
  return (
    <Container onPress={onClick} square={width}>
      <Icon name={name} color={theme.darkText} size={64}/>
      <Label>{label}</Label>
    </Container>
  )
}

CourseOption.defaultProps = {
  onClick: () => null,
  name: 'book',
  Icon: Icon,
  label: 'Announcements'
}

export default withTheme(CourseOption)