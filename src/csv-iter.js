import {csv_bind_parse_row} from './csv-row.js'
import {aiter_text_stream} from './aiter-utils.js'

export * from './csv-row.js'


export const _as_csv_lines = csv_lines => (
  // autodetect strings
  ('string' === typeof csv_lines)
    ? csv_lines.split(/$\r?\n?/m)

  : csv_lines
);

export function csv_from(csv_options, iter_csv_lines) {
  let res=[], n=0, csv_parse_row = csv_bind_parse_row(csv_options)
  let csv_feed = csv_parse_row

  iter_csv_lines = _as_csv_lines(iter_csv_lines)
  for (let line of iter_csv_lines) {
    let row = csv_feed(line, ++n)
    if ('function' !== typeof row) {
      csv_feed = csv_parse_row
      res.push( row )
    } else csv_feed = row
  }
  return res
}


export function * csv_iter(csv_options, iter_csv_lines) {
  let n=0, csv_parse_row = csv_bind_parse_row(csv_options)
  let csv_feed = csv_parse_row

  iter_csv_lines = _as_csv_lines(iter_csv_lines)
  for (let line of iter_csv_lines) {
    let row = csv_feed(line, ++n)
    if ('function' !== typeof row) {
      csv_feed = csv_parse_row
      yield row
    } else csv_feed = row
  }
}

