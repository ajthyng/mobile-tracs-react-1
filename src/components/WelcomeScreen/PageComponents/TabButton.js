import React, { PureComponent } from 'react'
import styled from 'styled-components'
import TabLabel from '../../../scenes/TabLabel'
import FA5Icon from 'react-native-vector-icons/FontAwesome5Pro'

const Container = styled.TouchableOpacity`
  max-width: 100px;
  flex-grow: 1;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  padding: 3px 0;
`

const Icon = styled(FA5Icon)`
  color: #3A6B86;
  font-size: 24px;
  padding-top: 5px;
`

const Dot = styled.View`
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: #b30e1b;
  position: absolute;
  top: 0;
  right: 25;
`

class TabButton extends PureComponent {
  render () {
    const { label: routeName, name, solid, dot } = this.props
    return (
      <Container>
        {dot ? <Dot /> : null}
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
