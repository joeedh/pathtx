interface IUnitBase<Type> {
  type: Type
}

interface IDef<subType extends 'none' | 'distance' | 'volume' | 'time'> {
  unitType: subType
}

type UnitDef = {
  none: 'none'
  feet: 'distance'
  meter: 'distance'
  pixel: 'distance'
}

export type Unit = keyof {[P in keyof UnitDef]: UnitDef[P]}
export type UnitType<unit extends Unit> = {[P in keyof UnitDef]: UnitDef[P]}[unit]

export abstract class UnitConverter<U extends Unit> {
  type: U
  unitType: UnitType<U>

  abstract toInternal(value: number)

  abstract fromInternal(value: number)

  abstract format(value: number): string

  abstract parse(value: string): number
}

export const internalUnits = Object.freeze({
  distance: 'meter',
  time    : 'second',
})

