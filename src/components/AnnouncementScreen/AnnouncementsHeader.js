import React, {PureComponent} from 'react'
import styled from 'styled-components'
import Icon from 'react-native-vector-icons/FontAwesome'

const Container = styled.View`
  align-self: stretch;
  background-color: ${props => props.theme.viewBackground};
  border-bottom-width: 1px;
  border-bottom-color: #80808080;
  padding: 10px 0 10px 24px;
  justify-content: center;
`

const TitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
`

const Title = styled.Text`
  font-size: 24px;
  color: ${props => props.theme.darkText};
`

const TitleIcon = styled(Icon)`
  font-size: 22;
  color: ${props => props.theme.darkText};
  margin-right: 8px;
`

const Subtitle = styled.Text`
  font-size: 19px;
  font-weight: 300;
  color: ${props => props.theme.darkText};
`

class GradebookHeader extends PureComponent {
  render () {
    const {title} = this.props
    return (
      <Container>
        <TitleContainer>
          <TitleIcon name='bullhorn' />
          <Title>Announcements</Title>
        </TitleContainer>
        <Subtitle>{title}</Subtitle>
      </Container>
    )
  }
}

export default GradebookHeader
