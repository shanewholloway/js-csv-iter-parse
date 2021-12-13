export * from './dsv_test_data.js'
import {source_array}  from './dsv_test_data.js'

export const tsv_array = source_array.map(row => row.join('\t'))
export const tsv_str_rn = tsv_array.join('\r\n')
export const tsv_str_n = tsv_array.join('\n')
export const tsv_str_r = tsv_array.join('\r')

