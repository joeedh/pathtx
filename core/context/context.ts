import {IBindingTypes, IDataAPI} from '../binding'

export interface IContext<B extends IBindingTypes> {
  api : IDataAPI<B>
}
