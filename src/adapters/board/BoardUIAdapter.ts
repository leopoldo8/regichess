import Mesh2D from "../../entities/2d/mesh";
import Position from "../../entities/2d/position";
import Board from "../../entities/chess/board";
import Observable from "../../utils/observable";

export type UISquareData = { displayPossibleMovementIndicator?: boolean };
export type UIDataMesh = Mesh2D<UISquareData>;

export type UIDataMeshChangeEvent = { UIDataMesh: UIDataMesh };

const defaultSquareData: UISquareData = {
  displayPossibleMovementIndicator: false,
}

export default class BoardUIAdapter extends Observable {
  constructor(
    public readonly board: Board,
  ) {
    super();

    this.UIDataMesh = new Mesh2D<UISquareData>([]);
  }

  UIDataMesh: UIDataMesh;

  state = {
    showingPossibleMovements: false,
  }

  setPossibleMovementsVisibility(visibility: boolean, positions?: Position[]) {
    this.state.showingPossibleMovements = visibility;

    if (positions) {
      this.UIDataMesh.bulkUpdate({ displayPossibleMovementIndicator: visibility }, positions);
    } else {
      this.UIDataMesh.updateAll({ displayPossibleMovementIndicator: visibility });
    }

    this.notify<UIDataMeshChangeEvent>("UIDataMeshChange", { UIDataMesh: this.UIDataMesh });
  }
  
  getOrCreateCellUIData(x: number, y: number) {
    if (!this.UIDataMesh.matrix[x]) {
      this.UIDataMesh.matrix[x] = [];
    }

    if (!this.UIDataMesh.matrix[x][y]) {
      this.UIDataMesh.matrix[x][y] = defaultSquareData;
    }

    return this.UIDataMesh.matrix[x][y];
  }
}
