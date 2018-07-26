import React, {Component} from 'react'
import styled from 'styled-components'
import Toggle from '../Toggle'

const Container = styled.View`
  height: 40px;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
`

const Label = styled.Text`
  font-size: 16px;
  text-align: left;
  color: ${props => props.theme.darkText};
  margin-left: 16px;
`

class SiteSetting extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {name, enabled} = this.props
    return (
      <Container>
        <Label>{name}</Label>
        <Toggle
          width={42}
          height={20}
          activeColor='dodgerblue'
        />
      </Container>
    )
  }
}

SiteSetting.defaultProps = {
  name: ''
}

export default SiteSetting