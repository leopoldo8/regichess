import styled, { css, keyframes } from 'styled-components';
import { checkeredBlack, checkeredWhite } from '../../styles/colors';

export const Table = styled.table`
  border-spacing: 0;
  border-collapse: collapse;
  color: white;
  margin: 0 auto;

  tr:nth-child(even) {
    td:nth-child(2n + 3) {
      background: ${checkeredBlack};
    }
  }

  tr:nth-child(odd) {
    td:nth-child(2n + 2) {
      background: ${checkeredBlack};
    }
  }
`;

export const TableHeader = styled.th`
  padding: .5em;
  pointer-events: none;
  user-select: none;
`;

const appearScale = keyframes`
  from {
    transform: scale(0);
  }

  to {
    transform: scale(1);
  }
`;

export const TableCell = styled.td<{ preview?: boolean }>`
  width: 90px;
  height: 90px;
  position: relative;
  background: ${checkeredWhite};

  ${({ preview }) => preview && css`
    &:after {
      content: '';
      display: block;
      position: absolute;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: rgba(0, 0, 0, 0.2);
      top: 50%;
      left: 50%;
      margin-top: -16px;
      margin-left: -16px;
      transform-origin: center;
      animation: ${appearScale} .15s ease-in-out;
    }
  `}
`;
