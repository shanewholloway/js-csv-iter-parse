import { terser as rpi_terser } from 'rollup-plugin-terser'
import pkg from './package.json'

const min_plugins = [ rpi_terser() ]

export default [
  ... add_out('csv-row'),
  ... add_out('csv-iter'),
  ... add_out('csv-aiter'),
  ... add_out('index', {out_name: pkg.name}),
]

function * add_out(src_name, opt={}) {
  let input = `src/${src_name}.js`
  let out_name = opt.name || opt.out_name || src_name

  yield { input, plugins: [],
    output: [
      { file: `esm/${out_name}.js`, format: 'es', sourcemap: true },
      { file: `cjs/${out_name}.js`, format: 'cjs', sourcemap: true},
      { file: `umd/${out_name}.js`, format: 'umd', sourcemap: true, name:out_name},
    ]}

  if (min_plugins)
    yield { input, plugins: min_plugins,
      output: [
        { file: `esm/${out_name}.min.js`, format: 'es', sourcemap: false},
        { file: `umd/${out_name}.min.js`, format: 'umd', sourcemap: false, name:out_name},
      ]}
}
