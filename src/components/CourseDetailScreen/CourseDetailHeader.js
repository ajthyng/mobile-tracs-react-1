import React, {PureComponent} from 'react'
import styled, {withTheme} from 'styled-components'
import {Dimensions, TouchableWithoutFeedback, Linking} from 'react-native'

const HeaderContainer = styled.View`
  height: 80px;
  align-self: stretch;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.courseDetailHeaderBackground};
  border-bottom-color: #80808080;
  border-bottom-width: 1px;
`

const TitleContainer = styled.View`
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  padding-left: 16px;
`

const Title = styled.Text`
  color: ${props => props.theme.darkText};
  font-size: 21px;
  font-weight: 600;
  padding: 4px 4px 4px 0;
`

const Subtitle = styled.Text`
  color: ${props => props.theme.darkText};
  font-size: 14px;
  font-weight: 300;
`

const Email = styled.Text`
  color: #0645AD;
  font-size: 14px;
  font-weight: 300;
  text-decoration: underline;
  text-decoration-color: #0645AD;
`

class CourseDetailHeader extends PureComponent {
  openEmail = () => {
    const {email, title} = this.props
    if (email) {
      Linking
        .openURL(`mailto:?to=${email}&subject=${title}`)
        .catch(() => null)
    }
  }

  render () {
    const {title, email} = this.props
    const {width} = Dimensions.get('window')
    return (
      <HeaderContainer width={width}>
        <TitleContainer>
          <Title>{title}</Title>
          <Subtitle>
            Faculty: {'\t'}
            <TouchableWithoutFeedback onPress={this.openEmail}>
              <Email>{email}</Email>
            </TouchableWithoutFeedback>
          </Subtitle>
        </TitleContainer>
      </HeaderContainer>
    )
  }
}

CourseDetailHeader.defaultProps = {
  title: 'Course Name Not Found',
  email: 'tracs@txstate.edu'
}

export default withTheme(CourseDetailHeader)
