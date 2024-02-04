import { getPieceMovementOptionsProps, getPieceMovementOptionsResult } from "../../../entities/chess/rules";
import BoardRelative from "../boardRelative";
import { MovementsStructuredArray } from "../pieceMovement";

export enum SpecialPieceMovements {
  enPassant = 'enPassant',
  leftCastling = 'left-castling',
  rightCastling = 'right-castling',
}

type Props = Omit<getPieceMovementOptionsResult, 'options'> & Omit<getPieceMovementOptionsProps, 'board'>;

export const specialMovementsActions: Record<SpecialPieceMovements, (props: Props) => MovementsStructuredArray> = {
  [SpecialPieceMovements.leftCastling]: ({ piece, to, leftRook }: Props) => ([
    {
      type: 'move',
      piece,
      to,
    },
    {
      type: 'move',
      piece: leftRook!,
      to: new BoardRelative(to!, piece.color).Right(1)
    }
  ]),
  [SpecialPieceMovements.rightCastling]: ({ piece, to, rightRook }: Props) => ([
    {
      type: 'move',
      piece,
      to,
    },
    {
      type: 'move',
      piece: rightRook!,
      to: new BoardRelative(to!, piece.color).Left(1)
    }
  ]),
  [SpecialPieceMovements.enPassant]: ({ piece, to, adjacentLeftPawn, adjacentRightPawn }: Props) => ([
    {
      type: 'move',
      piece,
      to,
    },
    {
      type: 'remove',
      piece: adjacentLeftPawn || adjacentRightPawn!
    }
  ])
}
