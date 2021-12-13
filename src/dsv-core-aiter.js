import {dsv_bind_parse_row, csv_parse_row, tsv_parse_row} from './dsv-row.js'
import {aiter_stream_lines} from './aiter-utils.js'


const _as_aiter_lines = aiter_lines => (
  // autodetect strings
  ('string' === typeof aiter_lines)
    ? aiter_lines.split(/$\r?\n?/m)

  // autodetect async iterables
  : aiter_lines[Symbol.asyncIterator]
    ? aiter_lines

  // autodetect ReadableStream
  : 'function' === typeof aiter_lines.getReader
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
    if ('function' !== typeof row) {
      dsv_feed = dsv_parse_row
      yield row
    } else dsv_feed = row
  }
}

export {_as_aiter_lines}
