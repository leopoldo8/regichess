import PiecesMovement from "../../pieceMovement/boardRelative";
import { PieceMovementProps, PieceMovementSegments } from "../pieceMovement";

export const BishopMovement = (props: PieceMovementProps): PieceMovementSegments => {
  const boardRelative = new PiecesMovement(props.position, props.color);

  const movement = {
    topLeft: boardRelative.SequenceOfMovement(boardRelative.Diagonal('left', 'top'), 8),
    bottomLeft: boardRelative.SequenceOfMovement(boardRelative.Diagonal('left', 'bottom'), 8),
    topRight: boardRelative.SequenceOfMovement(boardRelative.Diagonal('right', 'top'), 8),
    bottomRight: boardRelative.SequenceOfMovement(boardRelative.Diagonal('right', 'bottom'), 8)
  };

  return movement;
}
