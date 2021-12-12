import {csv_bind_parse_row} from './csv-row.js'
export * from './csv-row.js'


export const _as_csv_lines = csv_lines =>
  ('string' === typeof csv_lines)
    ? csv_lines.split(/$\r?\n?/m)
    : csv_lines


export function csv_from(csv_options, iter_csv_lines) {
  let n=0, csv_parse_row = csv_bind_parse_row(csv_options)
  let res = []
  for (let line of _as_csv_lines(iter_csv_lines)) {
    res.push( csv_parse_row(line, ++n) )
  }
  return res
}


export function * csv_iter(csv_options, iter_csv_lines) {
  let n=0, csv_parse_row = csv_bind_parse_row(csv_options)
  for (let line of _as_csv_lines(iter_csv_lines)) {
    yield csv_parse_row(line, ++n)
  }
}


export async function * csv_async_iter(csv_options, aiter_csv_lines) {
  let n=0, csv_parse_row = csv_bind_parse_row(csv_options)

  for await (let line of _as_csv_lines(await aiter_csv_lines)) {
    yield csv_parse_row(line, ++n)
  }
}

