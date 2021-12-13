import {csv_bind_parse_row} from './csv-row.js'
import {aiter_text_stream} from './aiter-utils.js'

export * from './csv-row.js'
export * from './aiter-utils.js'


export const _as_aiter_csv_lines = aiter_csv_lines => (
  // autodetect strings
  ('string' === typeof aiter_csv_lines)
    ? aiter_csv_lines.split(/$\r?\n?/m)

  // autodetect ReadableStream
  : 'function' === typeof aiter_csv_lines.getReader
    ? aiter_text_stream(aiter_csv_lines)

  : aiter_csv_lines
);


export async function * csv_async_iter(csv_options, aiter_csv_lines) {
  let n=0, csv_parse_row = csv_bind_parse_row(csv_options)
  let csv_feed = csv_parse_row

  aiter_csv_lines = _as_aiter_csv_lines(await aiter_csv_lines)
  for await (let line of aiter_csv_lines) {
    let row = csv_feed(line, ++n)
    if ('function' !== typeof row) {
      csv_feed = csv_parse_row
      yield row
    } else csv_feed = row
  }
}

