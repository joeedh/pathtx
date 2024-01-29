const vecCodeSnippets = {
  add      : [['b'], 'this[$] += b[$]'],
  sub      : [['b'], 'this[$] -= b[$]'],
  mul      : [['b'], 'this[$] *= b[$]'],
  div      : [['b'], 'this[$] /= b[$]'],

  addScalar: [['f'], 'this[$] += f'],
  subScalar: [['f'], 'this[$] -= f'],
  mulScalar: [['f'], 'this[$] *= f'],
  divScalar: [['f'], 'this[$] /= f'],

  zero     : [[], 'this[$] = 0.0'],
  negate   : [[], 'this[$] = -this[$]'],
  floor    : [[], 'this[$] = Math.floor(this[$])'],
  ceil     : [[], 'this[$] = Math.ceil(this[$])'],
  abs      : [[], 'this[$] = Math.abs(this[$])'],
  fract    : [[], 'this[$] -= Math.floor(this[$])'],
  min      : [['b'], 'this[$] = Math.min(this[$], b[$])'],
  max      : [['b'], 'this[$] = Math.max(this[$], b[$])'],
} as {[k: string]: [string[], string]}

export default vecCodeSnippets