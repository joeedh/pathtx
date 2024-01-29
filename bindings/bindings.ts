import {
  IBindingTypes,
  IBindPropertyBase,
  PropTypes,
  IIntProperty,
  IStructProperty,
  IBindProperty,
  IDataAPI,
  DataPath,
} from '@pathtx/core/binding'

export interface ITypes extends IBindingTypes {
  DataPath: string
}

export class PropertyBase<T extends PropTypes, V = any> implements IBindPropertyBase<T, V, ITypes> {
  type: T
  _value: V
  path: string
  apiName: string

  #binding?: {get(): V; set(v: V): void}

  get value() {
    return this.#binding ? this.#binding.get() : this._value
  }

  set value(v: V) {
    if (this.#binding) {
      this.#binding.set(v)
    } else {
      this._value = v
    }
  }

  constructor(args: {type: T; path?: string; apiName?: string; value: V}) {
    this.path = args.path ?? ''
    this.apiName = args.apiName ?? ''
    this.type = args.type ?? ''
    this.value = args.value
  }
}

export class IntProperty extends PropertyBase<'int', number> implements IIntProperty<ITypes> {
  constructor(args?: {value?: number; path?: string; apiName?: string}) {
    super({type: 'int', value: args?.value ?? 0, path: args?.path, apiName: args?.apiName})
  }
}

export class StructProperty<T = any>
  extends PropertyBase<'struct', T | undefined>
  implements IStructProperty<ITypes, T>
{
  name = ''
  memberMap: Map<string, Property> = new Map()

  constructor(args?: {name?: string; value?: T; path?: string; apiName?: string}) {
    super({type: 'struct', value: args?.value, path: args?.path, apiName: args?.apiName})
    this.name = args?.name ?? ''
  }

  getMembers(): Iterable<string> {
    return this.memberMap.keys()
  }

  getMember(key: string) {
    return this.memberMap.get(key)
  }
}

export class DataAPI implements IDataAPI<ITypes> {
  structs = new Map<any, StructProperty>()

  getStruct(Class: any): StructProperty {
    const st = this.structs.get(Class)
    if (st !== undefined) {
      return st
    }

    const name = typeof Class.name === 'string' ? Class.name : ''
    const st2 = new StructProperty({name})
    this.structs.set(Class, st2)
    return st2
  }

  resolveProperty(path: string): Property | undefined {
    return undefined
  }
}

export type Property = IntProperty | StructProperty<any>
