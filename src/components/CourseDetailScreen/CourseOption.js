import React from 'react'
import styled, {withTheme} from 'styled-components'
import Ripple from 'react-native-material-ripple'
import FAIcon from 'react-native-vector-icons/FontAwesome'

const Container = styled(Ripple)`
  width: 120px;
  height: 80px;
  border-radius: 3px;
  margin: 3px;
  align-items: center;
  justify-content: center;
`

const Label = styled.Text`
  margin-top: 12px;
  font-size: 12px;
  font-weight: 500;
  color: #3A6B86;
`

const Icon = styled(FAIcon)`
  color: #3A6B86;
  font-size: 38px;
`

const Dot = styled.View`
  background-color: #FF5050;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  position: absolute;
  top: 0;
  right: 30px;
  opacity: ${props => props.active ? 1 : 0};
`

const CourseOption = (props) => {
  const {label, name, Icon, onClick, newContent} = props
  return (
    <Container onPress={onClick}>
      <Icon name={name} />
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
