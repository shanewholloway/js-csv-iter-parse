
export function as_csv_options(opt) {
  opt = {... opt}
  opt.delimiter = `${opt.delimiter || ','}`
  opt.quote = `${opt.quote || '"'}`
  opt.escape = `${opt.escape || opt.quote}`
  return opt
}

export const csv_parse_row = /* #__PURE__ */
  csv_bind_parse_row()

export function csv_bind_parse_row(csv_options) {
  let {delimiter, quote, escape, missing_endquote} = as_csv_options(csv_options)

  return (line, info) =>
    (line = line.replace(/^[\r\n]+|[\r\n]+$/, ''))
      .includes(quote)
        ? _quoted_csv_line(line, info)
        : line.split(delimiter) // fast-path with no quotes

  function _quoted_csv_line(line, info) {
    // called when CSV line contains a quote character
    let res, cursor = 0, len = line.length
    let idx_quote = line.indexOf(quote, 0)
    let idx_delim = line.lastIndexOf(delimiter, idx_quote)

    if (-1 !== idx_delim) {
      // fast-path the leading cells up to the first cell with a quote
      res = line.slice(0, idx_delim).split(delimiter)
      cursor = idx_delim + delimiter.length
      idx_delim = line.indexOf(delimiter, cursor)
    } else res = [];

    for(;;) {
      if (-1 === idx_quote)
        // no more quotes in line; fast-path the remainder
        return res.concat(
          line.slice(cursor).split(delimiter))


      if (-1!==idx_delim && idx_delim < idx_quote) {
        // there is delimiter before the next quote
        // emit the next cell
        res.push(line.slice(cursor, idx_delim))
        cursor = idx_delim + delimiter.length
      } else {
        // idx_quote is in current cell
        let [i0, i1, ic] = _quoted_cell(line, idx_quote+1, len, info)
        res.push(line.slice(i0, i1))
        cursor = Math.max(ic, line.indexOf(delimiter, ic)+delimiter.length)
      }

      if (cursor+1 >= len)
        return res

      idx_delim = line.indexOf(delimiter, cursor)
      idx_quote = line.indexOf(quote, cursor)
    }
  }

  function _quoted_cell(line, i0, len, info) {
    // i0 = idx_quote + 1
    let iz, i1 = i0
    while (i1 < len) {
      i1 = line.indexOf(quote, i1)
      if (-1 === i1) {
        // missing end quote
        if (missing_endquote)
          missing_endquote({line, i0, len, info})
        return [i0, len, len]
      }

      iz = line.indexOf(escape)
      if (-1 !== iz && (i1 === iz+escape.length)) {
        i1++ // escaped; start again from after escaped i1
      } else {
        return [i0, i1, i1+quote.length]
      }
    }

    // this should never happen, but just in case
    return [i0, len, len]
  }
}

