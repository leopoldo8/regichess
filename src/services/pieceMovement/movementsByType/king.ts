import PiecesMovement from "../../pieceMovement/boardRelative";
import { PieceMovementProps, PieceMovementSegments, PositionWithProps, SpecialPieceMovements } from "../pieceMovement";

export const KingMovement = (props: PieceMovementProps): PieceMovementSegments => {
  const boardRelative = new PiecesMovement(props.position, props.color);

  const movement: PieceMovementSegments = {
    topLeft: [boardRelative.Diagonal('left', 'top')(1)],
    bottomLeft: [boardRelative.Diagonal('left', 'bottom')(1)],
    topRight: [boardRelative.Diagonal('right', 'top')(1)],
    bottomRight: [boardRelative.Diagonal('right', 'bottom')(1)],
    top: [boardRelative.Up(1)],
    bottom: [boardRelative.Down(1)],
    left: [boardRelative.Left(1)],
    right: [boardRelative.Right(1)],
  }

  /**
   * Castling logic
   */
  if (props.moveCount === 0) {
    if (props.leftRookMoved === false) {
      const position: PositionWithProps = boardRelative.Left(2);
      position.specialMovementType = SpecialPieceMovements.leftCastling;

      movement.left?.push(position);
    }

    if (props.rightRookMoved === false) {
      const position: PositionWithProps = boardRelative.Right(2);
      position.specialMovementType = SpecialPieceMovements.rightCastling;
      
      movement.right?.push(position);
    }
  }

  return movement;
}
