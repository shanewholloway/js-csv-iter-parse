import {csv_array, suite_root, expected_csv} from './csv_test_data.js'
import {arr_from_async} from './_utils.js'

import {csv_from, csv_iter, csv_async_iter} from 'csv-iter-parse'

const suite = suite_root.suite('csv from array')

suite.test('csv_from array', async () =>
  expected_csv(
    csv_from({}, csv_array) ))

suite.test('csv_iter array', async () =>
  expected_csv(
    [... csv_iter({}, csv_array)] ))

suite.test('csv_async_iter from array', async () =>
  expected_csv( arr_from_async(
    csv_async_iter({}, csv_array) )))

suite.test('csv_async_iter from Promise<array>', async () =>
  expected_csv( arr_from_async(
    csv_async_iter({}, Promise.resolve(csv_array)) )))

export {suite as suite_csv_array, suite as default}

