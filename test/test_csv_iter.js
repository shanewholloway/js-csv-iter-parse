import {csv_array, suite_root, expected_csv} from './csv_test_data.js'
import {arr_from_async, as_iter, as_async_iter} from './_utils.js'

import {csv_from, csv_iter, csv_async_iter} from 'csv-iter-parse'

const suite = suite_root.suite('csv from iterables')


suite.test('csv_from from iterable', async () =>
  expected_csv(
    csv_from({}, as_iter(csv_array)) ))



suite.test('csv_iter from iterable', async () =>
  expected_csv(
    [... csv_iter({}, as_iter(csv_array))] ))



suite.test('csv_async_iter from iterable', async () =>
  expected_csv( arr_from_async(
    csv_async_iter({}, as_iter(csv_array)) )))

suite.test('csv_async_iter from async iterable', async () =>
  expected_csv( arr_from_async(
    csv_async_iter({}, Promise.resolve(as_async_iter(csv_array))) )))

suite.test('csv_async_iter from Promise<iterable>', async () =>
  expected_csv( arr_from_async(
    csv_async_iter({}, as_iter(csv_array)) )))

suite.test('csv_async_iter from Promise<async iterable>', async () =>
  expected_csv( arr_from_async(
    csv_async_iter({}, Promise.resolve(as_async_iter(csv_array))) )))


export {suite as suite_csv_iterable, suite as default}

