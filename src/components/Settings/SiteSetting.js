import React from 'react'
import styled from 'styled-components'
import Toggle from '../Toggle'
import { types } from '../../constants/notifications'

const Container = styled.View`
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

const SiteSetting = ({ name, enabled, on, siteId, onValueChange, type }) => {
  const onToggle = on => {
    if (type === 'site') {
      return onValueChange({ other_keys: { site_id: siteId } }, on)
    } else if (type === types.ANNOUNCEMENT || type === types.FORUM) {
      return onValueChange({ keys: { object_type: type } }, on)
    }

    return onValueChange(on)
  }
  return (
    <Container>
      <Label numberOfLines={1}>{name}</Label>
      <Toggle
        enabled={enabled}
        onValueChange={onToggle}
        on={on}
        width={42}
        height={20}
        activeColor='#3A6B86'
      />
    </Container>
  )
}

SiteSetting.defaultProps = {
  name: ''
}

export default SiteSetting
