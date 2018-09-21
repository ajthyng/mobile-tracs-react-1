export const cardFromRight = (sceneProps) => {
  const { layout, position, scene } = sceneProps
  const { index } = scene

  const width = layout.initWidth
  const translateX = position.interpolate({
    inputRange: [index - 1, index, index + 1],
    outputRange: [width, 0, 0]
  })

  return { transform: [{ translateX }] }
}

export const cardFromLeft = (sceneProps) => {
  const { layout, position, scene } = sceneProps
  const { index } = scene

  const width = layout.initWidth

  const translateX = position.interpolate({
    inputRange: [index - 1, index, index + 1],
    outputRange: [-width, 0, 0]
  })

  return { transform: [{ translateX }] }
}
export const cardFromTop = (sceneProps) => {
  const { layout, position, scene } = sceneProps
  const { index } = scene

  const height = layout.initHeight

  const translateY = position.interpolate({
    inputRange: [index - 1, index, index + 1],
    outputRange: [-height, 0, 0]
  })

  const opacity = position.interpolate({
    inputRange: [index - 1, index, index + 0.99, index + 1],
    outputRange: [1, 1, 0.3, 0]
  })

  return { opacity, transform: [{ translateY }] }
}

export const cardFromBottom = (sceneProps) => {
  const { layout, position, scene } = sceneProps
  const { index } = scene

  const height = layout.initHeight

  const translateY = position.interpolate({
    inputRange: [index - 1, index, index + 1],
    outputRange: [height, 0, 0]
  })

  const opacity = position.interpolate({
    inputRange: [index - 1, index, index + 0.99, index + 1],
    outputRange: [1, 1, 0.3, 0]
  })

  return { opacity, transform: [{ translateY }] }
}

export const defaultTransition = (sceneProps) => ({})
