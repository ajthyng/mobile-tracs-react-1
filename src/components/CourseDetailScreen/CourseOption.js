import React, { PureComponent } from 'react'
import { TouchableOpacity } from 'react-native'
import styled, { withTheme } from 'styled-components'
import FAIcon from 'react-native-vector-icons/FontAwesome'

const Container = styled.View`
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
  color: ${props => props.enabled ? '#3A6B86' : '#80808040'};
`

const Icon = styled(FAIcon)`
  color: ${props => props.enabled ? '#3A6B86' : '#80808040'};
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
class CourseOption extends PureComponent {
  onPress = () => {
    const { onPress } = this.props
    onPress && onPress()
  }
  render () {
    const { label, name, Icon, newContent, enabled } = this.props

    return (
      <TouchableOpacity disabled={!enabled} onPress={this.onPress} >
        <Container>
          <Icon name={name} enabled={enabled} />
          <Label enabled={enabled} >{label.toUpperCase()}</Label>
          <Dot active={newContent} />
        </Container>
      </TouchableOpacity>
    )
  }
}

CourseOption.defaultProps = {
  name: 'book',
  Icon: Icon,
  label: 'Announcements'
}

export default withTheme(CourseOption)
