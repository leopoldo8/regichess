import Mesh2D from "../../2d/mesh";
import Position from "../../2d/position";
import Observable from "../../../utils/observable";

import Piece from "../piece";

export type MovePieceAndReplaceEvent = { pieceMoved: Piece, position: Position, pieceReplaced?: Piece };
export type RemovePieceEvent = { position: Position, pieceRemoved: Piece | null };

export default class Board extends Observable {
  constructor(
    public readonly id: string,
    readonly initialPieceMapGetter: (context: Board) => Piece[][]
  ) {
    super();

    this.pieceMesh = new Mesh2D(initialPieceMapGetter(this));
  }

  readonly pieceMesh: Mesh2D<Piece>;
  
  getPositionByPieceId(id: string) {
    return this.pieceMesh.find(item => item.id === id)?.index;
  }

  getPieceByPosition(position: Position): Piece | null {
    if (this.pieceMesh.matrix[position.x]) {
      return this.pieceMesh.matrix[position.x][position.y];
    }
  
    return null;
  }

  movePieceAndReplace(piece: Piece, position: Position) {
    this.removePiece(piece);
    const pieceReplaced = this.pieceMesh.replace(piece, position);

    this.notify<MovePieceAndReplaceEvent>("movePieceAndReplace", { pieceMoved: piece, position, pieceReplaced });
  }
   
  removePiece(prop: { id: string } | Position) {
    let position: Position | null = null;
    let piece: Piece | null = null;

    if (prop instanceof Position) {
      position = prop;
      piece = this.getPieceByPosition(prop);
    } else {
      const result = this.pieceMesh.find(piece => piece.id === prop.id);

      if (result) {
        piece = result.item;
        position = result.index;
      }
    }

    if (position) {
      this.pieceMesh.delete(position);
      this.notify<RemovePieceEvent>("removePiece", { position, pieceRemoved: piece });
    }
  }
}
