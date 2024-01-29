import {Unit} from '../units'

type IEventTypeBase<Type, Value> = {
  type: Type
  value: Value
  name?: string /** defaults to key in owning object literal. */
  uiName?: string
  /** Defaults to .name */
  description?: string
  /** Defaults to "" */
  allowCyclic?: boolean /** Default to false */
}

export interface IDependProperty extends IEventTypeBase<'depend', never> {}

interface INumProperty<Type extends string, Value = number> extends IEventTypeBase<Type, Value> {
  min?: Value
  max?: Value
  baseUnit?: Unit
  displayUnit?: Unit
  sliderExponent?: number
}

export interface IFloatProperty extends INumProperty<'float', number> {
  decimals?: number
}

export interface IIntProperty extends INumProperty<'int', number> {
  radix?: 2 | 10 | 16
}

export type IStringProperty = IEventTypeBase<'string', string>

export type IProperty = IDependProperty | IFloatProperty | IIntProperty | IStringProperty
export type EventSet = {readonly [k: string]: IProperty}

export class Emitter {
  static defineSlots<Property extends IProperty = IProperty>(): EventSet {
    return {} as const
  }
}

export class Test extends Emitter {
  static defineSlots() {
    return {
      f1: {type: 'string', value: 's'},
      f2: {type: 'float', value: 0},
    } as const
  }
}

interface IEventProperty<Type, Name, Value> {
  value: Value

  trigger(): void
}

export type EventTypes<ES extends EventSet> = {[P in keyof ES]: ES[P]['type']}

let a: EventTypes<ReturnType<(typeof Test)['defineSlots']>> | undefined
