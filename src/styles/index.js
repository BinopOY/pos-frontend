import { css, createGlobalStyle } from 'styled-components'

export const sizes = {
  largeDesktopUp: 1400,
  desktopUp: 1024,
  tabletLandscapeUp: 900,
  tabletPortraitUp: 600,
}

export const media = Object.keys(sizes).reduce((acc, label) => {
  acc[label] = (...args) => css`
    @media (min-width: ${sizes[label]}px) {
      ${css(...args)}
    }
  `
  return acc
}, {})

export const theme = {
  fontFamily: 'Muli, sans-serif',
  color: {
    text: '#FFF',
    background: '#0F0F0F',
    subText: '#878787',
    ageGroups: [
      '#3650A1',
      '#D4791E',
      '#5E0F75',
      '#33652E',
      '#6E470A',
      '#DB4033',
    ],
    ageGroupGradients: [
      '#D8CD41',
      '#DB8F43',
      '#78368B',
      '#547E50',
      '#856532',
      '#F67166',
    ],
    ageGroupGradientsDark: [
      '#211F05',
      '#221305',
      '#100F10',
      '#0F100F',
      '#120C02',
      '#3F1916',
    ],
    gradientDark: '#0F0F0F',
  },
}

export const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    width: 100%;
    height: 100%;
    font-family: ${({ theme }) => theme.fontFamily};
    color: ${({ theme }) => theme.color.text};
  }

  #root {
    width: 100%;
    height: 100%;
    position: relative;
  }
`
