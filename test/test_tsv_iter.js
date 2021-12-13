import {tsv_array, suite_root, expected_table} from './tsv_test_data.js'
import {arr_from_async, as_iter, as_async_iter} from './_utils.js'

import {tsv_from, tsv_iter, tsv_async_iter} from 'csv-iter-parse'

const suite = suite_root.suite('tsv from iterables')


suite.test('tsv_from from iterable', async () =>
  expected_table(
    tsv_from(as_iter(tsv_array)) ))



suite.test('tsv_iter from iterable', async () =>
  expected_table(
    [... tsv_iter(as_iter(tsv_array))] ))



suite.test('tsv_async_iter from iterable', async () =>
  expected_table( arr_from_async(
    tsv_async_iter(as_iter(tsv_array)) )))

suite.test('tsv_async_iter from async iterable', async () =>
  expected_table( arr_from_async(
    tsv_async_iter(Promise.resolve(as_async_iter(tsv_array))) )))

suite.test('tsv_async_iter from Promise<iterable>', async () =>
  expected_table( arr_from_async(
    tsv_async_iter(as_iter(tsv_array)) )))

suite.test('tsv_async_iter from Promise<async iterable>', async () =>
  expected_table( arr_from_async(
    tsv_async_iter(Promise.resolve(as_async_iter(tsv_array))) )))


export {suite as suite_tsv_iterable, suite as default}

