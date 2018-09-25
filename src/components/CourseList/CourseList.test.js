import { mapStateToProps } from './CourseList'

const site = {
  name: 'Banana-nana',
  contactInfo: {
    name: 'Andrew Thyng',
    email: 'andrew.thyng@txstate.edu'
  },
  tools: {
    'sakai.synoptic.announcement': {
      pageId: 'aa077d1c-2b42-4db5-972e-e7a727c4b809',
      id: '89edeaf2-e238-4f53-9648-ebcb34ebff1d'
    },
    'sakai.sitestats': {
      pageId: 'a7ff1e34-e335-43aa-904c-f727c6fec2b4',
      id: '20db4d64-47be-4ecc-b478-a5255c297198'
    },
    'sakai.gradebookng': {
      pageId: 'c61e4502-9efd-49d6-9d83-57d3994ad5f3',
      id: '5e7bd108-5911-411e-b4fd-b8af66b9f5f3'
    },
    'sakai.announcements': {
      pageId: 'cbab930d-dd9e-4cc1-b638-551befffd0d3',
      id: '1d04ba35-8f62-47a9-84d4-c0bf4b09a691'
    },
    'sakai.siteinfo': {
      pageId: 'daeb1c29-eddb-49f1-8097-4134a1fadc53',
      id: 'f30cf4d3-c7f4-4ac6-9bac-7f802c6dbc8c'
    },
    'sakai.iframe.site': {
      pageId: 'aa077d1c-2b42-4db5-972e-e7a727c4b809',
      id: '6ba4a9bb-3ea7-46c0-8c6f-5ea5c412dc64'
    }
  },
  owner: 'its-cms-testperms5',
  type: 'project',
  forumCount: 0,
  unseenCount: 0
}

const makeState = (properties = {}, siteId = 'mysiteid') => {
  const theme = {
    colors: {
      courseCard: {
        defaultColorBar: 'gray'
      }
    },
    ...properties.theme
  }

  const grades = {
    [siteId]: {
      mappedGrade: null,
      calculatedGrade: null
    },
    ...properties.grades
  }

  const notifications = {
    badgeCounts: {
      ...properties.badgeCounts
    }
  }

  const tracsSites = {
    userSites: {
      [siteId]: {
        id: siteId,
        ...site
      },
      ...properties.userSites
    },
    isUpdatingFavorites: false,
    favorites: [],
    ...properties.tracsSites
  }

  return {
    tracsSites,
    notifications,
    theme,
    grades,
    favoritesFilterActive: true,
    ...properties.state
  }
}

const makeProps = (properties = {}, siteId = 'mysiteid') => {
  return {
    sites: [
      {
        hasNewContent: true,
        color: 'gray',
        mappedGrade: 'B',
        calculatedGrade: '34.5666',
        isFavorite: false,
        id: siteId,
        ...site
      }
    ],
    favorites: [],
    isUpdatingFavorites: false,
    favoritesFilterActive: true,
    theme: {
      colors: {
        courseCard: {
          defaultColorBar: 'gray'
        }
      }
    },
    ...properties
  }
}

describe('state transform tests', () => {
  const siteId = '3ce5cd53-8f7e-42e7-8df2-9fa3a12f646d'

  it('should mark course having new content', () => {
    const state = makeState({
      badgeCounts: {
        [siteId]: {
          unseenCount: 1
        }
      }
    }, siteId)

    const expectedProps = makeProps({
      sites: [
        {
          hasNewContent: true,
          color: 'gray',
          mappedGrade: null,
          calculatedGrade: null,
          isFavorite: false,
          id: siteId,
          ...site
        }
      ]
    }, siteId)
    const mappedProps = mapStateToProps(state)

    expect(mappedProps).toEqual(expectedProps)
  })

  it('should not mark new content if badgecounts are 0', () => {
    const state = makeState({
      badgeCounts: {}
    }, siteId)

    const expectedProps = makeProps({
      sites: [{
        hasNewContent: false,
        color: 'gray',
        mappedGrade: null,
        calculatedGrade: null,
        isFavorite: false,
        id: siteId,
        ...site
      }]
    }, siteId)

    const mappedProps = mapStateToProps(state)

    expect(mappedProps).toEqual(expectedProps)
  })

  it('should mark site as favorite if its in favorites list', () => {
    const state = makeState({
      tracsSites: {
        favorites: [siteId]
      }
    }, siteId)

    const mappedProps = mapStateToProps(state)
    const expectedProps = makeProps({
      sites: [{
        hasNewContent: false,
        color: 'gray',
        mappedGrade: null,
        calculatedGrade: null,
        isFavorite: true,
        id: siteId,
        ...site
      }],
      favorites: [siteId]
    }, siteId)

    expect(mappedProps).toEqual(expectedProps)
  })

  it('should not fail for missing state keys', () => {
    const state = {}
    const mappedProps = mapStateToProps(state)

    expect(mappedProps).toEqual({
      sites: [],
      favorites: [],
      isUpdatingFavorites: false,
      favoritesFilterActive: true,
      theme: {}
    })
  })

  it('should default mapped and calculated grades to null', () => {
    const state = makeState({
      grades: {
        [siteId]: {}
      }
    }, siteId)

    const mappedProps = mapStateToProps(state)
    const expectedProps = makeProps({
      sites: [{
        hasNewContent: false,
        color: 'gray',
        isFavorite: false,
        id: siteId,
        ...site,
        calculatedGrade: null,
        mappedGrade: null
      }]
    }, siteId)
    expect(mappedProps).toEqual(expectedProps)
  })
})
