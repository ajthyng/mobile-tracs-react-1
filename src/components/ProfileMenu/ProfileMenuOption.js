import React, {Component} from 'react'
import FAIcon from 'react-native-vector-icons/FontAwesome'
import SLIcon from 'react-native-vector-icons/SimpleLineIcons'

import styled, {withTheme} from 'styled-components'

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding-left: 8px;
  width: 100%;
  height: 40px;
`

const Label = styled.Text`
  font-size: 14px;
  text-align: center;
  padding-left: 8px;
  color: ${props => props.theme.darkText};
`

class ProfileMenuOption extends Component {
  constructor (props) {
    super(props)
    this.getIcon = this.getIcon.bind(this)
  }

  getIcon (iconFamily) {
    switch (iconFamily) {
      case 'FontAwesome':
        return <FAIcon
          color={this.props.theme.darkText}
          style={{textAlign: 'center'}}
          name={this.props.icon}
          size={this.props.size}
        />
      case 'SimpleLineIcons':
        return <SLIcon
          color={this.props.theme.darkText}
          style={{textAlign: 'center'}}
          name={this.props.icon}
          size={this.props.size}
        />
      default:
        return null
    }
  }

  render () {
    const {label, iconFamily} = this.props
    const Icon = this.getIcon(iconFamily)
    return (
      <Container>
        {Icon}
        <Label>{label}</Label>
      </Container>
    )
  }
}

ProfileMenuOption.defaultProps = {
  iconFamily: 'FontAwesome'
}

export default withTheme(ProfileMenuOption)
