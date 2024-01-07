import PiecesMovement from "../../pieceMovement/boardRelative";
import { PieceMovementProps, PieceMovementSegments } from "../pieceMovement";

export const RookMovement = (props: PieceMovementProps): PieceMovementSegments => {
  const boardRelative = new PiecesMovement(props.position, props.color);

  const movement = {
    top: boardRelative.SequenceOfMovement(boardRelative.Up, 8),
    bottom: boardRelative.SequenceOfMovement(boardRelative.Down, 8),
    left: boardRelative.SequenceOfMovement(boardRelative.Left, 8),
    right: boardRelative.SequenceOfMovement(boardRelative.Right, 8),
  };

  return movement;
}
