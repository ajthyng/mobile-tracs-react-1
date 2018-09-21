import React, { PureComponent } from 'react'
import Svg, { Path } from 'react-native-svg'

class Arrow extends PureComponent {
  render () {
    const { height, width } = this.props
    return (
      <Svg height={height} width={width} viewBox='0 0 68.75 54.75' >
        <Path d='M29.73,24.23q3.39-4.82,6.5-9.82l-.91-.12a30.62,30.62,0,0,0,4.24,9c.36.53,1.23,0,.87-.5A29.94,29.94,0,0,1,36.28,14a.5.5,0,0,0-.91-.12q-3.12,5-6.5,9.82c-.37.53.5,1,.86.5Z' fill='none' stroke='#808080' />
        <Path d='M24.69,44.18A20.27,20.27,0,0,0,35.14,20.1a.5.5,0,0,0-1,.26,19.27,19.27,0,0,1-10,23c-.58.28-.07,1.15.51.86Z' fill='none' stroke='#808080' />
      </Svg>
    )
  }
}

Arrow.defaultProps = {
  height: 55,
  width: 55
}

export default Arrow
