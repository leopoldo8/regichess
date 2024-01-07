import Position from "../../entities/2d/position";
import Board from "../../entities/chess/board";

export default class BoardDOMAdapter {
  constructor(
    readonly board: Board
  ) {}

  get DOMElement(): HTMLElement  {
    return document.getElementById(this.board.id) || document.body;
  }

  changePiecesPointerEvents(value: string) {
    const pieces = this.DOMElement.querySelectorAll<HTMLElement>('[data-is-piece]');
    pieces.forEach(piece => { piece.style.pointerEvents = value; });
  }

  getPositionFromDOMElement(cellElement: HTMLElement): Position {
    const column = cellElement.getAttribute('data-column');

    if (!column) {
      throw new Error(`Column not found. The specified element have no data-column attribute.`);
    }

    const row = cellElement.parentElement?.getAttribute('data-row');

    if (!row) {
      throw new Error(`Row not found. The specified element have no parent element within an id.`);
    }

    return new Position(Number(row), Number(column));
  }

  getPositionFromPoint(point: Position) {
    this.changePiecesPointerEvents('none');

    const dropSquare = document.elementFromPoint(point.x, point.y) as HTMLElement;
    
    this.changePiecesPointerEvents('auto');

    if (!dropSquare) return;

    return this.getPositionFromDOMElement(dropSquare);
  }
}
