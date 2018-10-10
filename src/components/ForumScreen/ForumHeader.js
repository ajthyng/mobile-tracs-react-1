import React, { PureComponent } from 'react'
import styled from 'styled-components'
import Icon from 'react-native-vector-icons/FontAwesome'

const Container = styled.View`
  align-self: stretch;
  background-color: ${props => props.theme.viewBackground};
  border-bottom-width: 1px;
  border-bottom-color: #80808080;
  padding: 10px 0 10px 24px;
  justify-content: space-between;
  flex-direction: row;
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
  font-size: 17px;
  font-weight: 300;
  color: ${props => props.theme.darkText};
`

const HeaderContainer = styled.View`
  align-items: flex-start;
  justify-content: center;
`

const IconContainer = styled.TouchableOpacity`
  justify-content: center;
  padding-right: 16px;
`

class GradebookHeader extends PureComponent {
  render () {
    const { title, onPress } = this.props
    return (
      <Container>
        <HeaderContainer accessible accessibilityLabel={`Recent forum posts for ${title}`}>
          <TitleContainer>
            <TitleIcon name='comments' />
            <Title>Recent Forum Posts</Title>
          </TitleContainer>
          <Subtitle>{title}</Subtitle>
        </HeaderContainer>
        <IconContainer onPress={onPress} accessible accessibilityLabel='forums external web link' accessibilityHint='opens forums tool on web'>
          <Icon name='external-link' color='#6C6B6A' size={26} />
        </IconContainer>
      </Container>
    )
  }
}

export default GradebookHeader
