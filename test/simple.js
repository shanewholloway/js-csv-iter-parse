import {bareuvu, assert} from 'bareuvu'
import basic_rptr from 'bareuvu/esm/rptr/basic.mjs'

import {suite_root} from './csv_test_data.js'

import suite_csv_array from './test_csv_array.js'
import suite_csv_string from './test_csv_string.js'
import suite_csv_iterable from './test_csv_iter.js'

import suite_tsv_array from './test_tsv_array.js'
import suite_tsv_string from './test_tsv_string.js'
import suite_tsv_iterable from './test_tsv_iter.js'


let tid = setTimeout(Boolean, 5000) // keep nodejs open during async

let suite_main = suite_root
await suite_main.run_main(basic_rptr, {process})

tid = clearTimeout(tid)
