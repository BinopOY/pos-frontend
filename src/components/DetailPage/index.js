import React from 'react'
import styled from 'styled-components'
import { ArrowLeft } from 'react-feather'

const StyledDetailPage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  box-sizing: border-box;
  height: 100vh;
  width: 100vw;
  padding: 1rem;
  display: grid;
  grid-template-rows: auto auto 1fr;
  background-color: ${({ theme }) => theme.color.background};
  pointer-events: all;

  > h4 {
    margin: 0;
    padding: 0 2rem 1rem;
    font-size: 18px;
    text-align: center;
  }
`

const BackArrow = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  cursor: pointer;
`

const DetailPage = ({ onBackClick, title, children }) => {
  return (
    <StyledDetailPage>
      <BackArrow onClick={onBackClick} data-testid="back-arrow">
        <ArrowLeft />
      </BackArrow>
      <h4 data-testid="title">{title}</h4>
      {children}
    </StyledDetailPage>
  )
}

export default DetailPage
