import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { getAgeGroupTitleWithoutAges } from 'helpers'
import { renderWithTheme } from 'test'

import AgeGroupItem from './index'

const testAgeGroup = {
  ageGroupGuid: '053fa231362e95cb211c5eb85c3cbedb',
  guid: '053fa231362e95cb211c5eb85c3cbedb',
  item: {
    languages: [
      { lang: 'fi', title: 'Sudenpennut (7-9 v.)' },
      { lang: 'sv', title: 'Vargungar (7-9 år)' },
      { lang: 'en', title: 'Cub scouts: 7-10 years old' },
    ],
    guid: '053fa231362e95cb211c5eb85c3cbedb',
    lastModified: '2020-04-29 20:40:12',
    lastModifiedBy: null,
    maxAge: '9',
    minAge: '7',
    order: 0,
    title: 'Sudenpennut (7-9 v.)',
  },
}

describe('AgeGroupItem component', () => {
  it('displays the title of the given age group with the given language', () => {
    const language = 'sv'
    const { getByTestId } = renderWithTheme(
      <MemoryRouter>
        <AgeGroupItem ageGroup={testAgeGroup} language={language} user={{}} />
      </MemoryRouter>
    )
    const elem = getByTestId('title')
    expect(elem.innerHTML).toBe(
      getAgeGroupTitleWithoutAges(
        testAgeGroup.item.languages.find(lang => lang.lang === language).title
      )
    )
  })
})
