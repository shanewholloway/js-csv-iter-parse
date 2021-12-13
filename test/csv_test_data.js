export * from './dsv_test_data.js'
import {source_array}  from './dsv_test_data.js'

export const csv_array = source_array.map(row => row.join(','))
export const csv_str_rn = csv_array.join('\r\n')
export const csv_str_n = csv_array.join('\n')
export const csv_str_r = csv_array.join('\r')

