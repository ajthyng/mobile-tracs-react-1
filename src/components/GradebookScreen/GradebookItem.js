import React, {Component} from 'react'
import styled from 'styled-components'

const Container = styled.View`
  margin: 5px;
  align-items: flex-start;
  justify-content: center;
  background-color: ${props => props.theme.viewBackground};
  shadow-opacity: 0.8;
  shadow-color: #363534;
  shadow-radius: 1px;
  shadow-offset: 1px 1px;
  elevation: 2;
`

const Title = styled.Text`
  font-size: 16px;
  padding: 8px;
  color: ${props => props.theme.darkText}
`

const Grade = styled.Text`
  font-size: 16px;
  padding: 8px;
  color: ${props => props.theme.darkText}
`

const GradebookItem = ({title, grade}) => {
    return (
      <Container>
        <Title
          numberOfLines={1}
          ellipsizeMode='tail'
        >
          {title}
        </Title>
        <Grade>
          {grade}
        </Grade>
      </Container>
    )
}

GradebookItem.defaultProps = {
  title: 'Grade title not set',
  grade: '--'
}

export default GradebookItem