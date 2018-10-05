import React, { PureComponent } from 'react'
import Svg, { Path, ClipPath, Rect, Defs, G } from 'react-native-svg'
import styled from 'styled-components'

const Container = styled.View``

class BottomWave extends PureComponent {
  render () {
    const { style, color, transforms, screenWidth } = this.props
    return (
      <Container style={[style]}>
        <Svg height={screenWidth * 0.3} width={screenWidth} viewBox='0 0 424.01 122.81' style={{ transform: [{ scale: 1.02 }, ...transforms] }}>
          <Defs>
            <ClipPath id='clip-path'>
              <Rect fill='none' x='147.84' y='-151.43' width='124' height='428' transform='translate(146.71 272.25) rotate(-89.85)' />
            </ClipPath>
            <ClipPath id='clip-path-2'>
              <Path fill='none' clipRule='evenodd' d='M.92,35.05C-.67,31.71,56.63-1.56,110.66,6.23s92.81,35.08,141.8,33.51S334.47,6,367.4,10.32s56.52,23.93,56.52,23.93l-.24,90.89L.68,124Z' />
            </ClipPath>
            <ClipPath id='clip-path-3'>
              <Rect fill='none' x='152.84' y='-146.42' width='119' height='423' transform='translate(146.69 277.24) rotate(-89.85)' />
            </ClipPath>
          </Defs>
          <G clipPath='url(#clip-path)'>
            <G clipPath='url(#clip-path-2)'>
              <G clipPath='url(#clip-path-3)'>
                <Rect fill={color} x='147.84' y='-151.42' width='129' height='433' transform='translate(146.69 277.24) rotate(-89.85)' />
              </G>
            </G>
          </G>
        </Svg>
      </Container>
    )
  }
}

BottomWave.defaultProps = {
  color: '#501214',
  transforms: []
}

export default BottomWave
