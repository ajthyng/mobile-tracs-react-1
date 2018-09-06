import React from 'react'
import styled, {withTheme} from 'styled-components'
import {Dimensions, Text} from 'react-native'
import {FlatList, TouchableWithoutFeedback, StyleSheet} from 'react-native'
import Ripple from 'react-native-material-ripple'
import FAIcon from 'react-native-vector-icons/FontAwesome'

const Container = styled(Ripple)`
  width: 100px;
  height: 80px;
  border-radius: 3px;
  margin: 3px;
  background-color: #3A6B86;
  align-items: center;
  justify-content: center;
  
  shadow-color: #363534;
  shadow-opacity: 0.5;
  shadow-offset: 0 1px;
  shadow-radius: 1px;
`

const Label = styled.Text`
  margin-top: 8px;
  font-size: 8px;
  color: ${props => props.theme.lightText};
`

const Icon = styled(FAIcon)`
  color: ${props => props.theme.lightText};
  font-size: 40px;
`

const Dot = styled.View`
  background-color: ${props => props.theme.lightText}
  width: 10px;
  height: 10px;
  border-radius: 5px;
  position: absolute;
  top: 5px;
  right: 20px;
  opacity: ${props => props.active ? 1 : 0};
`

const CourseOption = (props) => {
  const {label, name, theme, Icon, onClick, newContent} = props
  return (
    <Container onPress={onClick}>
      <Icon name={name} color={theme.lightText} size={32} />
      <Label>{label.toUpperCase()}</Label>
      <Dot active={newContent} />
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
