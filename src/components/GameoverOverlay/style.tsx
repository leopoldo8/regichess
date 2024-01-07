import styled, { css } from 'styled-components';

export const Container = styled.div<{ isVisible: boolean; }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
  pointer-events: none;
  z-index: 100;

  ${({ isVisible }) => isVisible && css`
    opacity: 1;
    pointer-events: all;
  `}
`;

export const Title = styled.h2`
  color: #FFF;
`
