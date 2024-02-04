import React from 'react';

import { Container, PieceIMG, PieceItem } from './style';
import { PieceType, TGenericPieceColor } from '../../models';

type Props = {
  color: TGenericPieceColor;
  top?: number;
  left?: number;
  onResult: (type?: PieceType) => void;
}

export default function PromoteSelection({ color, top, left, onResult }: Props) {
  const selectPiece = (type: PieceType) => {
    onResult(type);
  }

  return (
    <Container id="promotion-selection" top={top} left={left}>
      {[PieceType.queen, PieceType.rook, PieceType.bishop, PieceType.knight].map((type) => (
        <PieceItem onClick={() => selectPiece(type)} key={type}>
          <PieceIMG src={`/${type}-${color}.svg`} />
        </PieceItem>
      ))}
    </Container>
  )
}
