import React, {Component} from 'react'
import {ScrollView} from 'react-native'

import {connect} from 'react-redux'
import styled from 'styled-components'
import Modal from 'react-native-modal'

import CourseCard from './CourseCard/CourseCard'
import CourseSkeletonCard from './CourseSkeletonCard'
import CourseScreen from '../CourseScreen/CourseScreen'

const CourseListContainer = styled.View`
	flex: 1;
	width: 100%;
`

const loadingSites = [
  <CourseSkeletonCard key='0' />,
  <CourseSkeletonCard key='1' />,
  <CourseSkeletonCard key='2' />,
  <CourseSkeletonCard key='3' />,
  <CourseSkeletonCard key='4' />,
  <CourseSkeletonCard key='5' />,
  <CourseSkeletonCard key='6' />,
]

class CourseList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      y: 0,
      isVisible: false,
      course: {}
    }

    this.modalAnimation = {
      from: { scale: 0, opacity: 0 },
      to: { scale: 1, opacity: 1 }
    }

    this.modalStyle = {
      marginTop: 55,
      marginBottom: 55,
      marginLeft: 20,
      marginRight: 20
    }
  }

  renderCourses = (loading) => {
    const {sites} = this.props

    return loading ?
      loadingSites :
      sites.map(item => (
        <CourseCard
          {...item}
          key={item.id}
          goToCourse={this.showModal(item)}
        />
      ))
  }

  showModal = (item) => () => {
    this.setState({isVisible: true, course: item})
  }

  hideModal = () => {
    this.setState({isVisible: false})
  }

  render() {
    return (
      <CourseListContainer>
        <ScrollView alwaysBounceVertical={false}>
          {this.renderCourses(this.props.loading)}
        </ScrollView>
        <Modal
          isVisible={this.state.isVisible}
          onBackButtonPress={this.hideModal}
          onBackdropPress={this.hideModal}
          swipeDirection='down'
          onSwipe={this.hideModal}
          animationIn={this.modalAnimation}
          style={this.modalStyle}
        >
          <CourseScreen
            course={this.state.course}
            navigation={this.props.navigation}
            dismiss={this.hideModal}
          />
        </Modal>
      </CourseListContainer>
    )
  }
}

const mapStateToProps = (state) => {
  const sites = Object.keys(state.tracsSites.userSites).reduce((accum, siteId) => {
    accum.push(state.tracsSites.userSites[siteId])
    return accum
  }, []).filter(state.tracsSites.filter(state.tracsSites.favorites))

  return {
    sites
  }
}

export default connect(mapStateToProps, null)(CourseList)