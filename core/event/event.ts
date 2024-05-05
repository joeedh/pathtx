import {Unit} from '../units'
import {EventLink} from './eventImpl'

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
export type IPointerProperty<T extends string> = IEventTypeBase<T, PointerEvent>

export type IProperty =
  | IPointerProperty<'pointerdown'>
  | IPointerProperty<'pointermove'>
  | IPointerProperty<'pointerup'>
  | IPointerProperty<'pointercancel'>
  | IPointerProperty<'pointerenter'>
  | IPointerProperty<'pointerleave'>
  | IDependProperty
  | IFloatProperty
  | IIntProperty
  | IStringProperty

//export type EventSet<T> = {[P in keyof T]: IProperty}
export type EventSet = {[k: string]: IProperty}

export type PropTypes = 'depend' | 'string' | 'float' | 'int'

export type Valid<T> = {[P in keyof T]: T[P] extends IProperty ? T[P] : never}

interface IEventProperty<Type, Name, Value> {
  value: Value
  name: Name

  //still fire event even when element is disconnected
  allowDisconnect: boolean

  emit(value?: Value): void

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

export class EmitterIdSet extends Map<any, number> {
  getID(obj : any) {
    let id = this.get(obj)

    if (id === undefined) {
      id = this.size
      this.set(obj, id)
    }

    return id
  }
}
export const elemCache = new EmitterIdSet()

export class RealEmitter<T extends IEmitter> extends Emitter {
  owningEventSet = elemCache

  constructor() {
    super()
  }

  defineSlots() {
    return {}
  }

  resolveEventLink(link: EventLink) : RealEmitter<any>|undefined {
    //
    return undefined
  }

  destroyComponent() {
    for (const prop of this.eraseSlotTypes()) {
      prop.disconnect();
    }

    elemCache.delete(this)
  }

  disconnectSlotsFromDom() {
    for (const prop of this.eraseSlotTypes()) {
      for (const link of prop.links) {
        const elem = this.resolveEventLink(link) as unknown as any
        if (elem === undefined) {
          continue
        }

        const prop2 = elem.slots[link.propName]
        for (const link of prop2.links) {
          if (link.destDirect === this) {
            link.elemID = this.owningEventSet.getID(this)
            link.destDirect = undefined
          }
        }
      }
    }
  }

  connectSlotsFromDom() {}

  eraseSlotTypes(): any[] {
    const ret = []

    const props = this.slots as unknown as any
    for (const k in props) {
      const v = props[k]
      ret.push(v)
    }

    return ret
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
a.f1.emit()


