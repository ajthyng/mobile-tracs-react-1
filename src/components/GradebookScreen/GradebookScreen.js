import React, {Component} from 'react'
import styled, {withTheme} from 'styled-components'
import {FlatList} from 'react-native'
import {connect} from 'react-redux'
import {getGrades} from '../../actions/grades'
import {NavigationActions} from 'react-navigation'
import ActivityIndicator from '../ActivityIndicator'
import GradebookItem from './GradebookItem'
import Header from './GradebookHeader'
import Footer from './GradebookFooter'

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: rgb(234, 234, 234);
`

const GradeList = styled(FlatList)``

const GradeListContainer = styled.View`
  margin: 16px;
  flex: 1;
  align-self: stretch;
`

class GradebookScreen extends Component {
  constructor (props) {
    super(props)
    this.course = this.props.navigation && this.props.navigation.getParam('course', {id: ''})
  }

  goToWeb = () => {
    const {id: siteId} = this.course
    const {navigation} = this.props

    const url = `${global.urls.baseUrl}${global.urls.webUrl}/${siteId}`
    const mainSite = `${global.urls.baseUrl}${global.urls.portal}`
    const openWebView = NavigationActions.navigate({
      routeName: 'TRACSWeb',
      params: {baseUrl: siteId ? url : mainSite, transition: 'cardFromRight'}
    })
    navigation.dispatch(openWebView)
  }

  componentDidMount () {
    const {getGrades} = this.props
    getGrades && getGrades()
  }

  renderGrade = ({item}) => {
    const subtitle = this.props.grades[this.course.id].name
    return <GradebookItem title={item.itemName} subtitle={subtitle} earned={item.grade} total={item.points} />
  }

  renderContent = () => {
    const {loading, grades} = this.props
    if (loading) return <ActivityIndicator />

    const courseGrades = (grades[this.course.id] || {}).grades || []
    return (
      <GradeListContainer>
        <GradeList
          data={courseGrades}
          renderItem={this.renderGrade}
          keyExtractor={(item, index) => index.toString(10)}
        />
      </GradeListContainer>
    )
  }

  render () {
    const {name} = this.course
    return (
      <Container>
        <Header title={name} />
        {this.renderContent()}
        <Footer onPress={this.goToWeb} />
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
