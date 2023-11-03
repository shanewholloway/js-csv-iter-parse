const as_cell = cell => cell?.trim?.() ?? cell
export const row_trim = row => row.map(as_cell)

function _tblrow_xform(row) {
  let hdr = this.header
  if (0===row.length || !hdr?.length || this.is_break?.(row, hdr)) {
    // resettable header after blank row or break
    this.header = this.as_header(row, hdr)
  } else return this.as_row(row, hdr, Math.max(row.length, hdr.length))
}
function _row_obj(row, hdr, len) {
  let res={},i=0,k
  for (; i<len; i++) {
    k = hdr[i] ?? 'c_'+i
    res[k] = this.as_cell(row[i], k)
  }
  return res
}
function _row_xform(row, hdr, len) {
  let res=[],i=0,k
  for (; i<len; i++) {
    k = hdr[i] ?? 'c_'+i
    res[i] = [k, this.as_cell(row[i], k)]
  }
  return this.as_record( pairs )
}

export function table_rows(opt={}) {
  let row_xform = opt.as_row || opt.call && opt
  if (row_xform)
    return row_xform

  opt = {__proxy__: opt }
  opt.as_cell ??= as_cell
  opt.as_header ??= row_trim
  opt.as_row ??= opt.as_record ? _row_xform : _row_obj
  return _tblrow_xform.bind(opt)
}

