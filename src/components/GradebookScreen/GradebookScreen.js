import React, {Component} from 'react'
import styled, {withTheme} from 'styled-components'
import {View, FlatList} from 'react-native'
import {connect} from 'react-redux'
import {getGrades} from '../../actions/grades'
import ActivityIndicator from '../ActivityIndicator'
import GradebookItem from './GradebookItem'

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.viewBackground};
  width: 100%;
`

const GradeList = styled(FlatList)`
  flex: 1;
  width: 100%;
`

class GradebookScreen extends Component {
  componentDidMount () {
    const {getGrades} = this.props
    getGrades && getGrades()
  }

  renderGrade = ({item}) => {
    let grade = '--'
    if (item.grade !== null) {
      grade = `${item.grade} / ${item.points}`
    }

    return <GradebookItem title={item.itemName} grade={grade} />
  }

  render () {
    const {loading, grades, navigation: {getParam}} = this.props
    const course = getParam('course', { id: '' })

    const courseGrades = (grades[course.id] || {}).grades || []
    return loading
      ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator />
        </View>
      )
      : (
        <Container>
          <GradeList
            data={courseGrades}
            renderItem={this.renderGrade}
            keyExtractor={(item, index) => index.toString(10)}
          />
        </Container>
      )
  }
}

const mapStateToProps = state => {
  const {loading, grades} = state
  return {
    loading,
    grades
  }
}

const mapDispatchToProps = dispatch => ({
  getGrades: () => dispatch(getGrades())
})

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(GradebookScreen))
