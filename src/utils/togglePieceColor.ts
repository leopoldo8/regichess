import { TGenericPieceColor, DefaultPieceColors } from "../models";

export default (color: TGenericPieceColor) => {
  if (color === DefaultPieceColors.white) return DefaultPieceColors.black;
  if (color === DefaultPieceColors.black) return DefaultPieceColors.white;

  return DefaultPieceColors.white;
}
