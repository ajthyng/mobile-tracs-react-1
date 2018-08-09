import React, {Component} from 'react'
import {FlatList, View} from 'react-native'
import styled, {withTheme} from 'styled-components'
import {getForums} from '../../actions/forums'
import {connect} from 'react-redux'
import ActivityIndicator from '../ActivityIndicator'
import Forum from './Forum'

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: ${props => props.theme.viewBackground};
`

const ForumsList = styled(FlatList)`
  width: 100%;
`

const Spinner = () => (
  <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
    <ActivityIndicator />
  </View>
)

class ForumScreen extends Component {
  componentDidMount () {
    let {getForums, course} = this.props

    getForums(course.id)
  }

  render() {
    const {forums, loading, course} = this.props
    return loading ? (<Spinner />) : (
      <Container>
        <ForumsList
          data={forums}
          renderItem={({item: {title, id}}) => <Forum title={title} siteId={course.id} forum={id} />}
          keyExtractor={item => item.entityURL}
        />
      </Container>
    )
  }
}

ForumScreen.defaultProps = {
  course: {
    id: 'f1003153-75b9-4abc-bc09-7a0e83d21293'
  }
}

const mapStateToProps = state => ({
  forums: state.forums.forums,
  loading: state.forums.loadingForums
})

const mapDispatchToProps = dispatch => ({
  getForums: (siteId) => dispatch(getForums(siteId))
})

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(ForumScreen))