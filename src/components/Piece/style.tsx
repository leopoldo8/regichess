import styled from 'styled-components';

export const PieceElement = styled.div`
  width: 90%;
  padding: 5%;
  cursor: grab;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  user-select: none;
  transition: transform 0.1s ease-in-out;
  transform: scale(1);

  &:hover {
    transform: scale(1.1);
  }
`;

export const PieceIMG = styled.img`
  max-width: 100%;
  width: 100%;
  pointer-events: none;
`;
