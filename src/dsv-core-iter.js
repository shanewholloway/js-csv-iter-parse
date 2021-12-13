import {dsv_bind_parse_row, csv_parse_row, tsv_parse_row, _table_as_json} from './dsv-row.js'
import {_is_fn} from './_utils.js'


const _as_lines = lines => (
  // autodetect strings
  ('string' === typeof lines)
    ? lines.split(/$\r?\n?/m)

  : lines
);


export const csv_from = iter_lines =>
  [... _dsv_iter(csv_parse_row, iter_lines, _as_lines)]

export const csv_iter = iter_lines =>
  _dsv_iter(csv_parse_row, iter_lines, _as_lines)

export const tsv_from = iter_lines =>
  [... _dsv_iter(tsv_parse_row, iter_lines, _as_lines)]

export const tsv_iter = iter_lines =>
  _dsv_iter(tsv_parse_row, iter_lines, _as_lines)



export const dsv_from = (dsv_options, iter_lines) =>
  [... dsv_iter(dsv_options, iter_lines)]

export function dsv_iter(dsv_options, iter_dsv_src) {
  let autodetect = dsv_options && dsv_options.autodetect || _as_lines

  return _dsv_iter(
    dsv_bind_parse_row(dsv_options),
    iter_dsv_src,
    autodetect)
}


export function * _dsv_iter(dsv_parse_row, iter_dsv_src, autodetect) {
  let n = 0, dsv_feed = dsv_parse_row

  iter_dsv_src = autodetect(iter_dsv_src)
  for (let line of iter_dsv_src) {
    let row = dsv_feed(line, ++n)
    if (_is_fn(row)) 
      dsv_feed = row
    else {
      dsv_feed = dsv_parse_row
      yield row
    }
  }
}

export function * table_iter_json(iter_rows) {
  let as_json = _table_as_json()
  for (let row of iter_rows) {
    row = as_json(row)
    if (row)
      yield row
  }
}

export const table_as_json = iter_rows =>
  [... table_iter_json(iter_rows)]

export {_as_lines}
