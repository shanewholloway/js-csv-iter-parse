import {_is_fn} from './_utils.js'

export function as_dsv_options(opt) {
  opt = {... opt}
  opt.delimiter = `${opt.delimiter || ','}`
  opt.quote = `${opt.quote || '"'}`
  opt.escape = `${opt.escape || opt.quote}`
  return opt
}

export const csv_parse_row = /* #__PURE__ */
  dsv_bind_parse_row()

export const tsv_parse_row = /* #__PURE__ */
  dsv_bind_parse_row({delimiter:'\t'})


export function dsv_bind_parse_row(dsv_options) {
  let {delimiter, quote, escape, missing_endquote} = as_dsv_options(dsv_options)

  return (line, info) =>
    (line = line.replace(/^[\r\n]+|[\r\n]+$/, ''))
      .includes(quote)
        ? _quoted_csv_line([], line, info, 0)
        : line ? line.split(delimiter) : [] // fast-path with no quotes

  function _quoted_csv_line(row, line, info, cursor) {
    // called when CSV line contains a quote character
    let iend = line.length - 1
    let idx_quote = line.indexOf(quote, cursor)
    let idx_delim = line.lastIndexOf(delimiter, idx_quote)

    if ((-1 !== idx_quote) && (-1 !== idx_delim) && (idx_delim<cursor)) {
      idx_delim = line.indexOf(delimiter, cursor)
    }

    if (-1 !== idx_delim) {
      // fast-path the leading cells up to the first cell with a quote
      row.push(... line.slice(cursor, idx_delim).split(delimiter))
      cursor = idx_delim + delimiter.length
      idx_delim = line.indexOf(delimiter, cursor)
    }

    for(;;) {
      if (-1 === idx_quote)
        // no more quotes in line; fast-path the remainder
        return row.concat(
          line.slice(cursor).split(delimiter))


      if (-1!==idx_delim && idx_delim < idx_quote) {
        // there is delimiter before the next quote
        // emit the next cell
        row.push(line.slice(cursor, idx_delim))
        cursor = idx_delim + delimiter.length
      } else {
        // idx_quote is in current cell
        let ans = _quoted_cell(row, line, idx_quote+1, iend, info)
        if (_is_fn(ans))
          return ans // read continued quote
        cursor = Math.max(ans, line.indexOf(delimiter, ans)+delimiter.length)
      }

      if (cursor >= iend)
        return row

      idx_delim = line.indexOf(delimiter, cursor)
      idx_quote = line.indexOf(quote, cursor)
    }
  }

  function _csv_splice(row, line, info) {
    // called when CSV line is continued from a previous line with an unmatched quote

    // idx_quote is in current cell
    let tail = row[row.length-1]
    let ans = _quoted_cell(row, line, 0, line.length, info)

    if (_is_fn(ans)) {
      // fixup tail with _quoted_cell result
      tail.push(... row.pop())
      return ans // read continued again quote
    } else tail.push(row.pop())

    // finished quote; resume csv quoted line alg from next delimiter
    let cursor = Math.max(ans, line.indexOf(delimiter, ans)+delimiter.length)
    return (cursor >= line.length-1) ? row
      : _quoted_csv_line(row, line, info, cursor)
  }

  function _quoted_cell(row, line, i0, iend, info) {
    // called for a quoted cell inside a csv line

    // when called, i0 = idx_quote + 1
    let iz, i1 = i0
    while (i1 < iend) {
      i1 = line.indexOf(quote, i1)
      if (-1 === i1) {
        // missing end quote
        row.push([line.slice(i0)])
        let fn_splice = _csv_splice.bind(null, row)
        return ! missing_endquote ? fn_splice
          : missing_endquote({row, line, i0, iend, info}, fn_splice)
      }

      iz = line.indexOf(escape)
      if (-1 !== iz && (i1 === iz+escape.length)) {
        i1++ // escaped; start again from after escaped i1
      } else {
        row.push(line.slice(i0, i1))
        return i1+quote.length
      }
    }

    // this should never happen, but just in case
    row.push(line.slice(i0, iend+1))
    return iend
  }
}

export function _table_as_json(hdr) {
  return row => {
    if (null != hdr) {
      if (!row.length)
        return

      let i=0,o={}
      for (; i<hdr.length; i++)
        if (null != row[i])
          o[hdr[i]] = row[i]
      return o
    } else hdr = row
  }
}

