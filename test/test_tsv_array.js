import {tsv_array, suite_root, expected_table} from './tsv_test_data.js'
import {arr_from_async} from './_utils.js'

import {tsv_from, tsv_iter, tsv_async_iter} from 'csv-iter-parse'

const suite = suite_root.suite('tsv from array')

suite.test('tsv_from array', async () =>
  expected_table(
    tsv_from(tsv_array) ))

suite.test('tsv_iter array', async () =>
  expected_table(
    [... tsv_iter(tsv_array)] ))

suite.test('tsv_async_iter from array', async () =>
  expected_table( arr_from_async(
    tsv_async_iter(tsv_array) )))

suite.test('tsv_async_iter from Promise<array>', async () =>
  expected_table( arr_from_async(
    tsv_async_iter(Promise.resolve(tsv_array)) )))

export {suite as suite_tsv_array, suite as default}

