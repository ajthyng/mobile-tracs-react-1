const _handlers = {}

const checkArgs = (actual, expected) => {
  if (actual !== expected) {
    throw new TypeError(`expected 2 arguments and received ${arguments.length}`)
  }
}

const Subject = {
  subscribe () {
    checkArgs(arguments.length, 2)

    const [event, handler] = arguments

    if (!_handlers[event]) _handlers[event] = []
    _handlers[event].push(handler)
  },
  unsubscribe () {
    checkArgs(arguments.length, 2)

    const [event, handler] = arguments

    if (!_handlers[event]) return
    _handlers[event] = _handlers[event].filter(func => func !== handler)
  },
  fire () {
    checkArgs(arguments.length, 1)

    const [event] = arguments

    if (!_handlers[event]) return
    _handlers[event].forEach(handler => {
      if (typeof handler === 'function') {
        handler()
      }
    })
  }
}

Object.freeze(Subject)

export default Subject
