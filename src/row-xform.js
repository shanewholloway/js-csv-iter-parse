const _cell_trim = cell =>
  cell.trim ? cell.trim() : cell

export const row_trim = row => row.map(_cell_trim)

function _ziphdr(hdr, row, as_cell=_cell_trim) {
  let o=[],i=0,len=Math.max(hdr.length, row.length)
  for (; i<len; i++)
    o[i] = [hdr[i] ?? 'c_'+i, _cell_trim(row[i])]
  return o
}

export function table_rows(opt={}) {
  let row_xform = opt.call
  if (! row_xform) {
    let hdr = opt.header
    let as_record = opt.as_record ?? Object.fromEntries
    row_xform = (row) =>
      ! row.length ? void 0
      : null == hdr ? void (hdr = opt.as_header?.(row) ?? row.map(_cell_trim))
      : as_record( _ziphdr(hdr, row, opt.as_cell) )
  }
  return row_xform
}

