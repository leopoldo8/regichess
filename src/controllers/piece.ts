import Board from "../entities/chess/board";
import Piece from "../entities/chess/piece";
import Player from "../entities/chess/player";
import Position from "../entities/2d/position";

import ChessBoardController from "./chessboard";

import BoardDOMAdapter from "../adapters/board/BoardDOMAdapter";

export default class PieceController {
  constructor(
    readonly piece: Piece,
    private readonly board: Board,
    private readonly player: Player,
    private readonly chessboardController: ChessBoardController,
  ) {
    this.boardDOMAdapter = new BoardDOMAdapter(this.board);
  }

  private readonly boardDOMAdapter: BoardDOMAdapter;

  onPieceDroppedOnSquare(clientX: number, clientY: number) {
    const position = this.boardDOMAdapter.getPositionFromPoint(new Position(clientX, clientY));

    if (!position) return;

    if (this.piece.currentPosition && !this.piece.currentPosition.isEqualTo(position)) {
      this.chessboardController.hidePiecePossibleMovements();
    }

    this.player.makeMove(this.piece, position);
  }

  onPieceClick() {
    this.player.showPiecePossibleMovements(this.piece);
  }

  onPieceDragStart() {
    this.player.showPiecePossibleMovements(this.piece);
  }
}
