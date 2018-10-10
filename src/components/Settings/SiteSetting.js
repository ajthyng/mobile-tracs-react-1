import React, { PureComponent } from 'react'
import styled from 'styled-components'
import Toggle from '../Toggle'
import { types } from '../../constants/notifications'

const Container = styled.TouchableOpacity`
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  padding: 8px 0;
`

const Label = styled.Text`
  flex: 1
  font-size: 16px;
  text-align: left;
  color: ${props => props.theme.darkText};
  margin-left: 16px;
`

class SiteSetting extends PureComponent {
  onToggle = (type, siteId) => on => {
    if (type === 'site') {
      return this.props.onValueChange({ other_keys: { site_id: siteId } }, on)
    } else if (type === types.ANNOUNCEMENT || type === types.FORUM) {
      return this.props.onValueChange({ keys: { object_type: type } }, on)
    }

    return this.onValueChange(on)
  }

  toggle = React.createRef()

  render () {
    const { name, enabled, on, siteId, type } = this.props
    return (
      <Container accessible={false}>
        <Label accessible={false} numberOfLines={1}>{name}</Label>
        <Toggle
          ref={this.toggle}
          enabled={enabled}
          onValueChange={this.onToggle(type, siteId)}
          on={on}
          width={42}
          height={20}
          activeColor='#3A6B86'
          accessible
          accessibilityLabel={`${name} notifications are ${on ? 'enabled' : 'disabled'}`}
          accessibilityHint={`toggles ${name} notifications`}
        />
      </Container>
    )
  }
}

SiteSetting.defaultProps = {
  name: ''
}

export default SiteSetting
