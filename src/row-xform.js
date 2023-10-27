const as_cell = cell => cell?.trim?.() ?? cell
export const row_trim = row => row.map(as_cell)

function _tblrow_xform(opt, row) {
  let hdr = opt.header
  let expect_data_row = 0!==row.length && hdr?.length && !opt.is_break?.(row, hdr)
  if (expect_data_row) {
    let pairs=[],k,i=0,len=Math.max(hdr.length, row.length)
    for (; i<len; i++) {
      k = hdr[i] ?? 'c_'+i
      pairs[i] = [k, opt.as_cell(row[i], k)]
    }
    return opt.as_record( pairs )
  } else {
    // resettable header after blank row or break
    opt.header = opt.as_header(row, hdr)
    // return undefined
  }
}

export function table_rows(opt={}) {
  let row_xform = opt.as_row || opt.call && opt
  if (! row_xform) {
    opt = {__proxy__: opt }
    opt.as_cell ??= as_cell
    opt.as_header ??= row_trim
    opt.as_record ??= Object.fromEntries
    row_xform = _tblrow_xform.bind(opt, opt)
  }
  return row_xform
}

