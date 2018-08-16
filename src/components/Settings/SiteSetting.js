import React from 'react'
import styled from 'styled-components'
import Toggle from '../Toggle'

const Container = styled.View`
  height: 40px;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
`

const Label = styled.Text`
  font-size: 16px;
  text-align: left;
  color: ${props => props.theme.darkText};
  margin-left: 16px;
`

const SiteSetting = ({name, enabled, on, siteId, onValueChange, type}) => {
  const onToggle = on => {
    if (type === 'site') {
      return onValueChange({other_keys: {site_id: siteId}}, on)
    } else {
      return onValueChange({keys: {object_type: type}}, on)
    }
  }
  return (
    <Container>
      <Label>{name}</Label>
      <Toggle
        enabled={enabled}
        onValueChange={onToggle}
        on={on}
        width={42}
        height={20}
        activeColor='dodgerblue'
      />
    </Container>
  )
}

SiteSetting.defaultProps = {
  name: ''
}

export default SiteSetting