import {dsv_bind_parse_row, csv_parse_row, tsv_parse_row} from './dsv-row.js'
import {aiter_stream_lines} from './aiter-utils.js'
import {_is_fn, _find_fn} from './_utils.js'

import {table_rows, row_trim} from './row-xform.js'


export const csv_async_iter = (aiter_dsv_src, opt) =>
  _dsv_async_iter(csv_parse_row, aiter_dsv_src, opt)

export const tsv_async_iter = (aiter_dsv_src, opt) =>
  _dsv_async_iter(tsv_parse_row, aiter_dsv_src, opt)

export const dsv_async_iter = (dsv_options, aiter_dsv_src) =>
  _dsv_async_iter(dsv_bind_parse_row(dsv_options), dsv_options, aiter_dsv_src)


export async function * _dsv_async_iter(dsv_parse_row, aiter_dsv_src, opt) {
  opt = { __proto__: _opt_dsv_aiter, ...opt }
  let n = 0, dsv_feed = dsv_parse_row

  aiter_dsv_src = await opt.autodetect(await aiter_dsv_src)
  for await (let line of aiter_dsv_src) {
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

export const as_aiter_lines = aiter_lines => (
  // autodetect strings
  ('string' === typeof aiter_lines)
    ? aiter_lines.split(/$\r?\n?/m)

  // autodetect Web (fetch) Response
  : _find_fn(aiter_lines, 'blob', 'json', 'text')
    ? aiter_stream_lines(aiter_lines.body)

  // autodetect Web ReadableStream or NodeJS readable stream
  : _find_fn(aiter_lines, 'getReader', 'pipe', 'pipeTo')
    ? aiter_stream_lines(aiter_lines)

  : aiter_lines
);

const _opt_dsv_aiter = {
  as_row: v=>v.length ? v : void v,
  autodetect: as_aiter_lines,
}


export async function * table_aiter(aiter_rows, opt) {
  let row_xform = table_rows(opt)
  for await (let row of aiter_rows)
    if (row = row_xform(row))
      yield row
}

export {
  table_rows, row_trim,
  table_aiter,
  table_aiter as table_aiter_json,
}
