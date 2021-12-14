import {_is_fn} from './_utils.js'

export function as_dsv_options(opt) {
  opt = {... opt}
  opt.delimiter = `${opt.delimiter || ','}`
  opt.quote = `${opt.quote || '"'}`
  opt.escape = `${opt.escape || opt.quote+opt.quote}`
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
        : !line ? [] // empty lines to empty array
        : line.split(delimiter) // fast-path with no quotes

  function _quoted_csv_line(row, line, info, cursor) {
    // called when CSV line contains a quote character
    let iend = line.length - 1
    let idx_quote = line.indexOf(quote, cursor)
    let idx_delim = line.lastIndexOf(delimiter, idx_quote)

    if (-1 !== idx_quote && -1 !== idx_delim && idx_delim<cursor) {
      // quote happened before initial cursor
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


      if (-1 !== idx_delim && idx_delim < idx_quote) {
        // there is delimiter before the next quote
        // emit the next cell
        row.push(line.slice(cursor, idx_delim))
        cursor = idx_delim + delimiter.length
      } else {
        if (cursor === idx_quote)
          cursor += quote.length // trim quotes when just after delimiter

        // idx_quote is in current cell
        cursor = _quoted_cell(row, line, info, cursor, idx_quote+quote.length)
        if (_is_fn(cursor))
          return cursor // read continued quote
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
    let cursor = _quoted_cell(row, line, info, 0, 0)

    if (_is_fn(cursor)) {
      // fixup tail with _quoted_cell result
      tail.push(... row.pop())
      return cursor // read continued again quote
    }
    tail.push(row.pop())

    // finished quote; resume csv quoted line alg from next delimiter
    return (cursor >= line.length-1) ? row
      : _quoted_csv_line(row, line, info, cursor)
  }

  function _quoted_cell(row, line, info, i0, i1) {
    // called for a quoted cell inside a csv line
    let cursor = i1, iend = line.length-1
    let idx_quote = line.indexOf(quote, cursor)
    let idx_delim = line.indexOf(delimiter, cursor)
    let idx_escape //= line.indexOf(escape, cursor)
    let cell = ''

    if (cursor === idx_quote) {
      // starting with an end quote
      let inext = cursor + quote.length
      if (inext === idx_delim) {
        row.push(cell)
        return inext + delimiter.length
      }

      if (inext >= iend) {
        row.push(cell)
        return iend
      }

      // otherwise a cell with embedded quotes
    }

    while (cursor <= iend) {
      if (-1 === idx_quote) {
        // missing end quote; return closure with current state
        row.push(cell = [cell + line.slice(i0)])
        let fn_splice = _csv_splice.bind(null, row)
        return ! missing_endquote ? fn_splice
          : missing_endquote({row, line, info, i0, cell}, fn_splice)
      }

      idx_escape = line.indexOf(escape, cursor)
      if (-1 === idx_escape) {
        // cell complete;
        // find the next delimiter after the end quote
        idx_delim = line.indexOf(delimiter, idx_quote)
        if (-1 === idx_delim) {
          // last cell of line
          i1 = (cursor = iend) + 1
        } else cursor = (i1 = idx_delim) + 1

        if (idx_quote+quote.length === i1)
          i1 = idx_quote // trim quotes when just before delimiter or end of line

        
        row.push(cell + line.slice(i0, i1))
        return cursor

      } else {
        // found an escape sequence;
        // translate escapes back to quotes
        cell += line.slice(i0, idx_escape) + quote

        // advance past and start at the top
        i0 = cursor = idx_escape + escape.length
      }

      idx_quote = line.indexOf(quote, cursor)
    }
    row.push(line.slice(i0, i1))
    return cursor
  }
}

export function _table_as_json(hdr) {
  return row => {
    if (!row.length)
      return

    if (null == hdr) {
      hdr = row
    } else {
      let i=0,o={}
      for (; i<hdr.length; i++)
        if (null != row[i])
          o[hdr[i]] = row[i]
      return o
    }
  }
}

