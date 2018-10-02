import React, { Component } from 'react'
import styled, { withTheme } from 'styled-components'
import { connect } from 'react-redux'
import { getGrades } from '../../actions/grades'
import { NavigationActions } from 'react-navigation'
import ActivityIndicator from '../ActivityIndicator'
import GradebookItem from './GradebookItem'
import Header from './GradebookHeader'
import Footer from './GradebookFooter'
import EmptyGrades from './EmptyGrades'

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: rgb(234, 234, 234);
`

const GradeList = styled.ScrollView`
  align-self: stretch;
`

const GradeListContainer = styled.View`
  margin: 10px;
  align-self: stretch;
`

class GradebookScreen extends Component {
  constructor (props) {
    super(props)
    this.course = this.props.navigation && this.props.navigation.getParam('course', { id: '' })
  }

  goToWeb = () => {
    const { navigation } = this.props
    const course = navigation && navigation.getParam('course', { id: '' })
    const { id: siteId } = course
    const url = `${global.urls.baseUrl}${global.urls.webUrl}/${siteId}`
    const mainSite = `${global.urls.baseUrl}${global.urls.portal}`
    const openWebView = NavigationActions.navigate({
      routeName: 'TRACSWeb',
      params: {
        course,
        baseUrl: siteId ? url : mainSite,
        transition: 'cardFromRight'
      }
    })
    navigation.dispatch(openWebView)
  }

  componentDidMount () {
    const { getGrades, loading } = this.props
    if (!loading) {
      getGrades && getGrades()
    }
  }

  renderGrade = (item, i) => {
    const subtitle = this.props.grades[this.course.id].name
    return <GradebookItem key={i.toString(10)} title={item.itemName} subtitle={subtitle} earned={item.grade} total={item.points} />
  }

  renderContent = () => {
    const { loading, grades } = this.props
    if (loading) return <ActivityIndicator />

    const courseGrades = (grades[this.course.id] || {}).grades || []
    const gradesList = courseGrades.map(this.renderGrade)
    return (
      <GradeList>
        <GradeListContainer>
          {gradesList.length > 0 ? gradesList : <EmptyGrades />}
        </GradeListContainer>
        <Footer onPress={this.goToWeb} />
      </GradeList>
    )
  }

  render () {
    const { name } = this.course
    return (
      <Container>
        <Header title={name} />
        {this.renderContent()}
      </Container>
    )
  }
}

const mapStateToProps = state => {
  const { grades, grades: { isLoading: loading } } = state
  return {
    loading,
    grades
  }
}

const mapDispatchToProps = dispatch => ({
  getGrades: () => dispatch(getGrades())
})

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(GradebookScreen))
