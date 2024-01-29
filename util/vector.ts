import vectorCodeSnippets from './vectorCodeSnippets'

export type VectorSizes = 2 | 3 | 4

type numlits = {2: 2 | 3 | 4; 3: 3 | 4; 4: 4}
export type NumLitHigher<L extends 2 | 3 | 4> = numlits[L]

export type Index1 = 0
export type Index2 = 0 | 1
export type Index3 = 0 | 1 | 2
export type Index4 = 0 | 1 | 2 | 3
export type Index5 = 0 | 1 | 2 | 3 | 4

export interface IVectorArray<LEN extends VectorSizes> {
  [k: number]: number

  length: LEN
}

export interface IBaseVector<LEN extends VectorSizes> extends IVectorArray<LEN> {
  copy(): this

  load(b: VecOrHigher<this, LEN>): this

  add(b: VecOrHigher<this, LEN>): this

  sub(b: VecOrHigher<this, LEN>): this

  mul(b: VecOrHigher<this, LEN>): this

  div(b: VecOrHigher<this, LEN>): this
}

export type VecOrHigher<Type, LEN extends VectorSizes> = Type | IBaseVector<NumLitHigher<LEN>>

export interface IVectorConstructor<LEN extends VectorSizes> {
  new (value?: this | number[] | VecOrHigher<IBaseVector<LEN>, LEN>): IBaseVector<LEN>
}

export interface IVectorArrayConstructor<LEN extends VectorSizes> {
  new (size: number): IVectorArray<LEN>
}

/* eslint-disable */
export function makeBaseVector<LEN extends VectorSizes>(
  len: LEN,
  parentArray: IVectorArrayConstructor<LEN> = Array<number> as unknown as IVectorArrayConstructor<LEN>
): IVectorConstructor<LEN> {
  var BaseVector: IVectorConstructor<LEN> | undefined

  let Index = new Array(len)
  for (let i=0; i<len; i++) {
    Index[i] = i;
  }

  let code = `\
  BaseVector = class BaseVector extends parentArray {
    constructor(value) {
      super(len)

      if (value) {
        this.load(value)
      } else {
        this.zero()
      }
    }

    length: LEN
    
    dot(b) {
      return ${Index.map(i => `this[${i}] * b[${i}]`).join(" + ")}
    }
    
    vectorLengthSqr() {
      return ${Index.map(i => `this[${i}] * this[${i}]`).join(" + ")}
    }
    
    vectorLength() {
      return Math.sqrt(this.vectorLengthSqr())
    }
    
    normalize()
      const length = this.vectorLength()
      if (length > 0.000001) {
        return this.mulScalar(1.0 / length);
      }
      
      return this; 
    }
  `

  for (const [name, snippet] of Object.entries(vectorCodeSnippets)) {
    code += `
    ${name}(${snippet[0].join(',')} {
      `
    for (let i = 0; i < len; i++) {
      code += `      ${snippet[1].replace(/\$/g, '' + i)}\n`
    }

    code += `
      return this;
    }    
    `
  }

  code += '}'

  console.log("code:", code)

  eval(code)
  return BaseVector as unknown as IVectorConstructor<LEN>
}

/* eslint-enable */

export class Vector3 extends makeBaseVector<3>(3) {
  //
}


