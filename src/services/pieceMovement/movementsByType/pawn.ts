import PiecesMovement from "../../pieceMovement/boardRelative";
import { PieceMovementProps, PieceMovementSegments } from "../pieceMovement";

export const PawnMovement = (props: PieceMovementProps): PieceMovementSegments => {
  const boardRelative = new PiecesMovement(props.position, props.color);

  const movement: PieceMovementSegments = {
    top: [],
    topLeft: [],
    topRight: []
  };

  if (props.isTakingAPiece) {
    movement.topLeft?.push(boardRelative.Diagonal('left', 'top')(1));
    movement.topRight?.push(boardRelative.Diagonal('right', 'top')(1));

    return movement;
  }

  movement.top?.push(boardRelative.Up(1));

  if (props.moveCount === 0) {
    movement.top?.push(boardRelative.Up(2));
  }

  return movement;
}
