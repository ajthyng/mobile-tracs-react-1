import { mapStateToProps } from './CourseDetailScreen'
import dayjs from 'dayjs'

const makeGrade = (properties) => {
  return {
    comment: 'Great Job on this very difficult exam.',
    dueDate: 1537246800000,
    grade: '83',
    itemName: 'Test Two',
    points: 100,
    postedDate: 1536156219000,
    userId: '45d8e9e7-0b87-4f2d-b5da-b5cfb69ba544',
    userName: 'Mynameistoolong',
    ...properties
  }
}

describe('state transform tests', () => {
  it('should return empty grades if course id is null', () => {
    const state = {
      grades: {}
    }
    const props = {
      navigation: {
        getParam: () => ({ id: null })
      }
    }

    const mappedProps = mapStateToProps(state, props)

    expect(mappedProps).toEqual({
      course: { id: null },
      grades: []
    })
  })

  it('should return empty grades if state is missing grades key', () => {
    const state = {}

    const props = {
      navigation: {
        getParam: () => ({ id: '1234' })
      }
    }

    const mappedProps = mapStateToProps(state, props)

    expect(mappedProps).toEqual({
      course: { id: '1234' },
      grades: []
    })
  })

  it('should sort recent grades to the top by date posted', () => {
    const course = {
      id: '5'
    }

    const today = dayjs()
    const yesterday = today.subtract(1, 'day')
    const dayBeforeYesterday = yesterday.subtract(1, 'day')

    const first = makeGrade({ postedDate: today })
    const second = makeGrade({ postedDate: yesterday })
    const third = makeGrade({ postedDate: dayBeforeYesterday })

    const props = {
      navigation: {
        getParam: () => course
      }
    }

    const state = {
      grades: {
        '5': {
          grades: [second, third, first]
        }
      }
    }

    const mappedProps = mapStateToProps(state, props)

    expect(mappedProps).toEqual({
      course,
      grades: [first, second, third]
    })
  })

  it('should return empty array if grades object is invalid', () => {
    const state = {
      grades: {
        '5': {
          grades: 'not an array'
        }
      }
    }
    const props = {
      navigation: { getParam: () => ({ id: '5' }) }
    }

    const mappedState = mapStateToProps(state, props)

    expect(mappedState).toEqual({
      course: { id: '5' },
      grades: []
    })
  })

  it('should filter null posted dates and grades', () => {
    const graded50 = makeGrade({ postedDate: null, grade: '50' })
    const noGrade = makeGrade({ postedDate: null, grade: null })
    const graded25 = makeGrade({ postedDate: null, grade: '25' })
    const graded30 = makeGrade({ postedDate: null, grade: '30' })

    const state = {
      grades: {
        '5': {
          grades: [graded50, graded25, noGrade, graded30, noGrade, graded30]
        }
      }
    }

    const props = {
      navigation: { getParam: () => ({ id: '5' }) }
    }

    const mappedProps = mapStateToProps(state, props)

    expect(mappedProps).toEqual({
      course: { id: '5' },
      grades: [ graded30, graded30, graded25, graded50 ]
    })

    expect(mappedProps.grades.slice(0, 2)).toEqual([graded30, graded30])
  })

  it('should include graded item with no posted date if only one posted date', () => {
    const graded50 = makeGrade({ postedDate: null, grade: '50' })
    const noGrade = makeGrade({ postedDate: null, grade: null })
    const posted100 = makeGrade({ grade: '100' })
    const graded30 = makeGrade({ postedDate: null, grade: '30' })
    const state = {
      grades: {
        '5': {
          grades: [posted100, graded50, noGrade, graded30]
        }
      }
    }

    const props = {
      navigation: { getParam: () => ({ id: '5' }) }
    }

    const mappedProps = mapStateToProps(state, props)

    expect(mappedProps).toEqual({
      course: { id: '5' },
      grades: [posted100, graded30, graded50]
    })
  })
})
