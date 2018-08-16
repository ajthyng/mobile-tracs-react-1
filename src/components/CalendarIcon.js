import React from 'react'
import {Animated, TouchableOpacity} from 'react-native'
import styled from 'styled-components'
import Icon from 'react-native-vector-icons/FontAwesome'

const Touchable = styled(TouchableOpacity)`
	flex-direction: row;
	align-items: center;
	justify-content: center;
	background-color: transparent;
`

const StyledCalendarIcon = styled(Icon)`
	font-size: ${props => props.size}px;
`

const CalendarIcon = ({onPress, size, color}) => (
  <Touchable onPress={onPress}>
    <StyledCalendarIcon
      size={size}
      name='calendar'
      color={color}
    />
  </Touchable>
)

CalendarIcon.defaultProps = {
  size: 28,
  color: 'white',
  onPress: () => {
  }
}

export default CalendarIcon