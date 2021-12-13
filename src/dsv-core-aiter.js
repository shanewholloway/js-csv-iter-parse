import {dsv_bind_parse_row, csv_parse_row, tsv_parse_row, _table_as_json} from './dsv-row.js'
import {aiter_stream_lines} from './aiter-utils.js'
import {_is_fn, _find_fn} from './_utils.js'


const _as_aiter_lines = aiter_lines => (
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


export function csv_async_iter(aiter_lines) {
  return _dsv_async_iter(csv_parse_row, aiter_lines, _as_aiter_lines) }

export function tsv_async_iter(aiter_lines) {
  return _dsv_async_iter(tsv_parse_row, aiter_lines, _as_aiter_lines) }



export async function dsv_async_iter(dsv_options, aiter_dsv_src) {
  let autodetect = dsv_options && dsv_options.autodetect || _as_aiter_lines
  aiter_dsv_src = await autodetect(await aiter_dsv_src)

  return _dsv_async_iter(
    dsv_bind_parse_row(dsv_options),
    aiter_dsv_src)
}


export async function * _dsv_async_iter(dsv_parse_row, aiter_dsv_src, autodetect) {
  let n = 0, dsv_feed = dsv_parse_row

  aiter_dsv_src = await autodetect(await aiter_dsv_src)
  for await (let line of aiter_dsv_src) {
    let row = dsv_feed(line, ++n)
    if (_is_fn(row)) 
      dsv_feed = row
    else {
      dsv_feed = dsv_parse_row
      yield row
    } 
  }
}

export async function * table_aiter_json(aiter_rows) {
  let as_json = _table_as_json()
  for await (let row of aiter_rows) {
    row = as_json(row)
    if (row)
      yield row
  }
}

export {_as_aiter_lines}
