import {IPointerProperty, RealEmitter} from '../event'
import {IBindingTypes} from '../binding'
import {IContext} from '../context'

export class Component<B extends IBindingTypes, CTX extends IContext<B>> extends RealEmitter<Component<B, CTX>> {
  ctx: CTX

  constructor() {
    super()

    //this.slots.pointerdown.trigger()
  }

  defineSlots() {
    const ptr = <T extends string>(key: T) => {
      return {type: key, value: new PointerEvent(key)} as IPointerProperty<T>
    }

    return {
      ...super.defineSlots(),
      pointerdown  : ptr('pointerdown'),
      pointermove  : ptr('pointermove'),
      pointerup    : ptr('pointerup'),
      pointercancel: ptr('pointercancel'),
      pointerenter : ptr('pointerenter'),
      pointerleave : ptr('pointerleave'),
    }
  }
}