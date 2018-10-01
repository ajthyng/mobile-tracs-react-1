import React, { PureComponent } from 'react'
import styled from 'styled-components'

const Label = styled.Text`
  color: ${props => props.tintColor};
  font-size: 12px;
  line-height: 12px;
  padding-top: 5px;
  text-align: center;
`

class TabLabel extends PureComponent {
  render () {
    const { route: { routeName: title }, tintColor } = this.props
    return (
      <Label numberOfLines={1} tintColor={tintColor}>{title}</Label>
    )
  }
}

TabLabel.defaultProps = {
  iconName: '',
  tintColor: '#3A6B86'
}

export default TabLabel
