import {tsv_str_n, tsv_str_rn, tsv_str_r, suite_root, expected_table} from './tsv_test_data.js'
import {arr_from_async} from './_utils.js'

import {tsv_from, tsv_iter, tsv_async_iter} from 'csv-iter-parse'


const suite = suite_root.suite('tsv from strings and file content')


suite.test('tsv_from from string (\\r\\n)', async () =>
  expected_table(
    tsv_from(tsv_str_rn) ))

suite.test('tsv_from from string (\\n)', async () =>
  expected_table(
    tsv_from(tsv_str_n) ))

suite.test('tsv_from from string (\\r)', async () =>
  expected_table(
    tsv_from(tsv_str_r) ))



suite.test('tsv_iter from string (\\r\\n)', async () =>
  expected_table(
    [... tsv_iter(tsv_str_rn)] ))

suite.test('tsv_iter from string (\\n)', async () =>
  expected_table(
    [... tsv_iter(tsv_str_n)] ))

suite.test('tsv_iter from string (\\r)', async () =>
  expected_table(
    [... tsv_iter(tsv_str_r)] ))



suite.test('tsv_async_iter from string (\\r\\n)', async () =>
  expected_table( arr_from_async(
    tsv_async_iter(tsv_str_rn) )))

suite.test('tsv_async_iter from string (\\n)', async () =>
  expected_table( arr_from_async(
    tsv_async_iter(tsv_str_n) )))

suite.test('tsv_async_iter from string (\\r)', async () =>
  expected_table( arr_from_async(
    tsv_async_iter(tsv_str_r) )))

suite.test('tsv_async_iter from Promise<string>', async () =>
  expected_table( arr_from_async(
    tsv_async_iter(Promise.resolve(tsv_str_rn)) )))


export {suite as suite_tsv_string, suite as default}

