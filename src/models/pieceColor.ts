export type TGenericPieceColor = string & { readonly brand: unique symbol };

export const DefaultPieceColors = {
  white: 'white' as TGenericPieceColor,
  black: 'black' as TGenericPieceColor,
}
