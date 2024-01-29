import {Unit} from '../units'

type IEventTypeBase<Type extends string, Value> = {
  readonly type: Type
  value: Value
  name?: string /** defaults to key in owning object literal. */
  uiName?: string
  /** Defaults to .name */
  description?: string
  /** Defaults to "" */
  allowCyclic?: boolean /** Default to false */
}

export type IDependProperty = IEventTypeBase<'depend', never>

type INumProperty<Type extends string, Value = number> = IEventTypeBase<Type, Value> & {
  min?: Value
  max?: Value
  baseUnit?: Unit
  displayUnit?: Unit
  sliderExponent?: number
}

export type IFloatProperty = INumProperty<'float', number> & {
  decimals?: number
}
export type IIntProperty = INumProperty<'int', number> & {
  radix: 2 | 10 | 16
}
export type IStringProperty = IEventTypeBase<'string', string>
export type IPointerDown = IEventTypeBase<'pointerdown', PointerEvent>

export type IProperty = IPointerDown | IDependProperty | IFloatProperty | IIntProperty | IStringProperty

//export type EventSet<T> = {[P in keyof T]: IProperty}
export type EventSet = {[k: string]: IProperty}

export type PropTypes = 'depend' | 'string' | 'float' | 'int'

export type Valid<T> = {[P in keyof T]: T[P] extends IProperty ? T[P] : never}

interface IEventProperty<Type, Name, Value> {
  value: Value
  name: Name

  trigger(value?: Value): void

  connect(dest: IEventProperty<Type, string, Value>): void
}

type EventTypes<ES extends {[k: string]: IProperty}> = {
  [P in keyof ES]: IEventProperty<ES[P]['type'], P, ES[P]['value']>
}
type EventValids<ES extends {[k: string]: IProperty}> = keyof ES

export type IEmitter = {
  defineSlots(): EventSet
}
export type EventBag<Class extends IEmitter> = EventTypes<ReturnType<Class['defineSlots']>>
export type ValidEvents<Class extends IEmitter> = EventValids<ReturnType<Class['defineSlots']>>

//return t as IProperty
/*
return t as ({
  readonly [P in keyof T as P extends 'type' ? P : never] : T[P]
} & {
  [P in keyof T as P extends 'type' ? never : P] : T[P]
})*/

export class Emitter extends HTMLElement {
  constructor() {
    super()
  }

  defineSlots(): EventSet {
    return {}
  }
}

export class RealEmitter<T extends IEmitter> extends Emitter {
  constructor() {
    super()
  }

  defineSlots() {
    return {}
  }

  slots: EventBag<T>

  fireEvent(event: ValidEvents<T>, data: any): void {
    //
  }
}

export class Test extends RealEmitter<Test> {
  defineSlots() {
    return {
      ...super.defineSlots(),
      f1    : {type: 'string', value: 's'} as IStringProperty,
      f2    : {type: 'float', value: 0} as IFloatProperty,
      i1    : {type: 'float', value: 0} as IFloatProperty,
      depend: {type: 'depend'} as IDependProperty,
    }
  }
}

const g = new Test()
g.fireEvent('f1', {})

let a = {} as unknown as EventBag<Test>
a.f1.value = 's'
a.f2.value = 3
a.i1.value = 4
a.f1.trigger()


