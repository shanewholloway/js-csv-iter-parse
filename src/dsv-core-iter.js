import {dsv_bind_parse_row, csv_parse_row, tsv_parse_row} from './dsv-row.js'
import {_is_fn} from './_utils.js'

import {table_rows, row_trim} from './row-xform.js'

export const csv_from = (iter_dsv_src, opt) =>
  [... _dsv_iter(csv_parse_row, iter_dsv_src, opt)]

export const csv_iter = (iter_dsv_src, opt) =>
  _dsv_iter(csv_parse_row, iter_dsv_src, opt)

export const tsv_from = (iter_dsv_src, opt) =>
  [... _dsv_iter(tsv_parse_row, iter_dsv_src, opt)]

export const tsv_iter = (iter_dsv_src, opt) =>
  _dsv_iter(tsv_parse_row, iter_dsv_src, opt)

export const dsv_from = (iter_dsv_src, opt) =>
  [... dsv_iter(iter_dsv_src, opt)]

export const dsv_iter = (dsv_options, iter_dsv_src) =>
  _dsv_iter(dsv_bind_parse_row(dsv_options), dsv_options, iter_dsv_src)


export function * _dsv_iter(dsv_parse_row, iter_dsv_src, opt) {
  opt = { __proto__: _opt_dsv_iter, ...opt }
  let n = 0, dsv_feed = dsv_parse_row

  iter_dsv_src = opt.autodetect(iter_dsv_src)
  for (let line of iter_dsv_src) {
    let row = dsv_feed(line, ++n)
    if (_is_fn(row))
      dsv_feed = row
    else {
      dsv_feed = dsv_parse_row
      if (row = opt.as_row(row))
        yield row
    }
  }
}

export const as_iter_lines = lines => (
  // autodetect strings
  ('string' === typeof lines)
    ? lines.split(/$\r?\n?/m)

  : lines
);

const _opt_dsv_iter = {
  as_row: v=>v.length ? v : void v,
  autodetect: as_iter_lines,
}


export function * table_iter(iter_rows, opt) {
  let row_xform = table_rows(opt)
  for (let row of iter_rows)
    if (row = row_xform(row))
      yield row
}

export const table_as_json = (iter_rows, opt) =>
  [... table_iter(iter_rows, opt)]

export {
  table_rows, row_trim,
  table_iter,
  table_iter as table_iter_json,
}
