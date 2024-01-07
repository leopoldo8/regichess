import ChessBoardController from '../../controllers/chessboard';
import PieceController from '../../controllers/piece';

import { onMouseDown } from './draggable';

import { PieceElement, PieceIMG } from './style';

type Props = {
  PieceController: PieceController;
}

const Piece = ({ PieceController }: Props) => {
  const dropPiece = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { clientX, clientY } = e;

    PieceController.onPieceDroppedOnSquare(clientX, clientY);
  };

  return (
    <PieceElement
      onClick={() => PieceController.onPieceClick()}
      onMouseDown={(e) => onMouseDown(e)}
      onMouseUpCapture={(e) => dropPiece(e)}
      data-piece={PieceController.piece.id}
      data-is-piece="true"
    >
      <PieceIMG
        src={`/${PieceController.piece.type}-${PieceController.piece.color}.svg`}
      />
    </PieceElement>
  );
}

export default Piece;
