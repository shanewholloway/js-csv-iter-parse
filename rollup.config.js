import { terser as rpi_terser } from 'rollup-plugin-terser'
import pkg from './package.json'

const min_plugins = [ rpi_terser() ]

export default [
  ... add_out('csv-row'),

  ... add_out('csv-from'),
  ... add_out('csv-iter'),
  ... add_out('csv-async-iter'),

  ... add_out('csv-iter-parse', {name: pkg.name}),
]

function * add_out(src_name, opt={}) {
  let input = `src/${src_name}.js`

  yield { input, plugins: [],
    output: [
      { file: `esm/${src_name}.js`, format: 'es', sourcemap: true },
      { file: `cjs/${src_name}.js`, format: 'cjs', sourcemap: true, exports: 'auto' },
      { file: `umd/${src_name}.js`, format: 'umd', sourcemap: true, name:opt.name || src_name},
    ]}

  if (min_plugins)
    yield { input, plugins: min_plugins,
      output: [
        { file: `esm/${src_name}.min.js`, format: 'es', sourcemap: false},
        { file: `umd/${src_name}.min.js`, format: 'umd', sourcemap: false, name:opt.name || src_name},
      ]}
}
