import {IPointerDown, RealEmitter} from '../event'
import {IBindingTypes} from '../binding'
import {IContext} from '../context'

export class Component<B extends IBindingTypes, CTX extends IContext<B>> extends RealEmitter<Component<B, CTX>> {
  ctx: CTX

  constructor() {
    super()
    
    //this.slots.pointerdown.trigger()
  }

  defineSlots() {
    return {
      ...super.defineSlots(),
      pointerdown: {type: 'pointerdown', value: new PointerEvent('pointerdown')} as IPointerDown,
    }
  }
}