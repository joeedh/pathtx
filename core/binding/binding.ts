export type PropTypes = 'float' | 'int' | 'string' | 'vec2' | 'vec3' | 'vec4' | 'list' | 'enum' | 'flags' | 'struct'

export interface IBindingTypes<T = any> {
  DataPath: T
}

export type DataPath<binding extends IBindingTypes> = binding['DataPath']

export interface IBindPropertyBase<T, V, B extends IBindingTypes> {
  type: T
  value: V
  path: DataPath<B>
  apiName: string
  uiName?: string
  description?: string
  readOnly?: boolean
}

interface INumProperty<B extends IBindingTypes, V> extends IBindPropertyBase<'int', V, B> {
  min?: number
  max?: number
  radix?: number
}

export interface IIntProperty<B extends IBindingTypes> extends INumProperty<B, number> {}

export interface IStructProperty<B extends IBindingTypes, V = any>
  extends IBindPropertyBase<'struct', V | undefined, B> {
  name: string

  getMembers(): Iterable<string>

  getMember(key: string): IBindProperty<B> | undefined
}

export type IBindProperty<B extends IBindingTypes> = IIntProperty<B> | IStructProperty<B>

export interface IDataAPI<B extends IBindingTypes> {
  getStruct(Class: any): IStructProperty<B, any>

  resolveProperty(path: DataPath<B>): IBindProperty<B> | undefined
}




