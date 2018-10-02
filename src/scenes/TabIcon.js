import React, { PureComponent } from 'react'
import FA5ProIcon from 'react-native-vector-icons/FontAwesome5Pro'
import styled from 'styled-components'

const Icon = styled(FA5ProIcon)`
  color: ${props => props.tintColor};
  font-size: 24px;
  padding-top: 5px;
`

class TabIcon extends PureComponent {
  render () {
    const { focused, iconName, tintColor } = this.props

    return (
      <Icon name={iconName} solid={focused} tintColor={tintColor} />
    )
  }
}

export default TabIcon
