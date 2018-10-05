import React, { PureComponent } from 'react'
import styled from 'styled-components'
import TabLabel from '../../../scenes/TabLabel'
import FA5Icon from 'react-native-vector-icons/FontAwesome5Pro'

const Container = styled.View`
  max-width: 100px;
  flex-grow: 1;
  flex-shrink: 1;
  align-items: center;
  justify-content: space-between;
  padding: 3px 0;
`

const Icon = styled(FA5Icon)`
  color: #3A6B86;
  font-size: 24px;
  padding-top: 5px;
`

class TabButton extends PureComponent {
  render () {
    const { label: routeName, name, solid } = this.props
    return (
      <Container>
        <Icon name={name} solid={solid} />
        <TabLabel tintColor='#3A6B86' route={{ routeName }} />
      </Container>
    )
  }
}

TabButton.defaultProps = {
  label: 'Default',
  name: 'bullhorn'
}

export default TabButton
