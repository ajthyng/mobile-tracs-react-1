import React, { PureComponent } from 'react'
import { Dimensions } from 'react-native'
import styled from 'styled-components'
import Swiper from 'react-native-swiper'
import BottomWave from './BottomWave'
import PageDot from './PageDot'
import Page from './Page'
import PageOne from './PageComponents/PageOne'
import PageTwo from './PageComponents/PageTwo'
import PageThree from './PageComponents/PageThree'
import PageFour from './PageComponents/PageFour'
import WelcomeImage from './WelcomeImage'
import WelcomeText from './WelcomeText'
import Button from './Button'

const Container = styled.View`
  flex: 1;
  background-color: white;
`

const DarkWave = styled(BottomWave)`
  height: 80px;
  position: relative;
  bottom: 0;
`

const LightWave = styled(BottomWave)`
  height: 80px;
  position: absolute;
  bottom: 10;
  left: 25%;
`

const messages = [
  'Easily view recently posted grades\nand any related grade comments',
  'Use the new course navigation bar\nto quickly access common tools',
  'Use FAVORITES to get quick access\nto the sites you use most often',
  'In ALL SITES, tap the star to quickly\nadd or remove sites from FAVORITES'
]

const PageOneImage = styled(WelcomeImage)`
  flex: 3;
`

const PageOneText = styled(WelcomeText)`
  justify-content: flex-start;
  align-self: center;
`

const Buttons = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 0 16px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
`

const Skip = styled(Button)`
  text-align: left;
`
const Next = styled(Button)`
  text-align: right;
`

class WelcomeScreen extends PureComponent {
  state = {
    width: Dimensions.get('window').width,
    index: 0
  }

  swiper = React.createRef()

  onPress = () => {
    const { onPress } = this.props
    onPress && onPress()
  }

  componentDidMount () {
    Dimensions.addEventListener('change', this.updateWidth)
  }

  componentWillUnmount () {
    Dimensions.removeEventListener('change', this.updateWidth)
  }

  updateWidth = ({ window }) => this.setState({ width: window.width })

  updateIndex = index => this.setState({ index })

  skip = () => {
    const { index } = this.state
    if (index < 3) {
      this.swiper.current.scrollBy && this.swiper.current.scrollBy(3 - index)
    }
  }

  nextPage = () => {
    const { index } = this.state
    if (index < 3) {
      this.swiper.current.scrollBy && this.swiper.current.scrollBy(1)
    } else {
      this.props.onPress && this.props.onPress()
    }
  }

  render () {
    const { width, index } = this.state

    return (
      <Container>
        <Swiper
          loop={false}
          ref={this.swiper}
          activeDot={<PageDot active />}
          dot={<PageDot />}
          onIndexChanged={this.updateIndex}
        >
          <Page>
            <PageOneImage content={() => <PageOne />} />
            <PageOneText>{messages[0]}</PageOneText>
          </Page>
          <Page>
            <WelcomeImage content={() => <PageTwo />} />
            <WelcomeText>{messages[1]}</WelcomeText>
          </Page>
          <Page>
            <WelcomeImage content={() => <PageThree />} />
            <WelcomeText>{messages[2]}</WelcomeText>
          </Page>
          <Page>
            <WelcomeImage content={() => <PageFour />} />
            <WelcomeText>{messages[3]}</WelcomeText>
          </Page>
        </Swiper>
        <LightWave
          color='rgba(80, 18, 20, 0.3)'
          screenWidth={width}
          transforms={[{ scaleX: 1.2 }]}
        />
        <DarkWave
          screenWidth={width}
          transforms={[{ scaleX: 1.05 }]}
        />
        <Buttons>
          {index >= 3 ? null : <Skip label='SKIP' onPress={this.skip} />}
          <Next label={index >= 3 ? 'DONE' : 'NEXT'} onPress={this.nextPage} />
        </Buttons>
      </Container>
    )
  }
}

export default WelcomeScreen
