import styled from "styled-components";

export const Container = styled.div<{ top?: number; left?: number }>`
  width: 100px;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  overflow: hidden;
  position: absolute;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);

  ${({ top, left }) => `
    top: ${top || 0}px;
    left: ${left || 0}px;
  `}
`;

export const PieceItem = styled.a`
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
`;

export const PieceIMG = styled.img`
  width: 70%;
  pointer-events: none;
`;
