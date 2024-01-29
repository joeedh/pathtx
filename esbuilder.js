import * as esbuild from 'esbuild'

let options = {
  entryPoints: ['core/index.ts', 'util/index.ts'],
  outdir     : './build',
  bundle     : true,
  sourcemap  : true,
  minify     : false,
  treeShaking: false,
  logLevel   : 'info',
  format     : 'esm',
  platform   : 'browser',
  external   : [],
  splitting  : true,
  keepNames  : true,
  logOverride: {'direct-eval': 'silent'},
}

const handlers = {
  async help() {
    console.log('\nUsage: esbuilder --watch,-w --help\n')
  },
  async build() {
    await esbuild.build(options)
  },

  async watch() {
    let ctx = await esbuild.context(options)
    await ctx.watch()
  },
}

let mode = 'build'
for (let arg of process.argv) {
  if (arg === '-w' || arg === '--watch') {
    mode = 'watch'
  }

  if (arg === '-h' || arg === '--help') {
    mode = 'help'
    break
  }
}

await handlers[mode]();
