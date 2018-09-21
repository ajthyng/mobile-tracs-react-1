import React, { PureComponent } from 'react'
import styled from 'styled-components'
import Grade from './Grade'

const Container = styled.View`
  height: 70px;
  align-self: stretch;
  flex-direction: row;
  background-color: ${props => props.theme.viewBackground};
`

const Title = styled.Text`
  font-size: 20px;
  line-height: 20px;
  font-weight: 400;
  color: ${props => props.theme.darkText};
`

const SubTitle = styled.Text`
  font-size: 12px;
  line-height: 14px;
  color: ${props => props.theme.darkText};
`

const Info = styled.View`
  flex: 1;
  height: 100%;
  padding: 0 8px 0 16px;
  justify-content: center;
`

const GradeContainer = styled.View`
  width: 70px;
  height: 100%;
`

class GradebookItem extends PureComponent {
  render () {
    const { earned, total, title, subtitle } = this.props
    return (
      <Container>
        <GradeContainer>
          <Grade earned={earned} total={total} />
        </GradeContainer>
        <Info>
          <Title numberOfLines={1} ellipsizeMode='tail'>
            {title}
          </Title>
          <SubTitle>{subtitle}</SubTitle>
        </Info>
      </Container>
    )
  }
}

GradebookItem.defaultProps = {
  title: 'Grade title not set',
  grade: '--'
}

export default GradebookItem
