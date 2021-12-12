import {csv_str_n, csv_str_rn, csv_str_r, suite_root, expected_csv} from './csv_test_data.js'
import {arr_from_async} from './_utils.js'

import {csv_from, csv_iter, csv_async_iter} from 'csv-iter-parse'


const suite = suite_root.suite('csv from strings and file content')


suite.test('csv_from from string (\\r\\n)', async () =>
  expected_csv(
    csv_from({}, csv_str_rn) ))

suite.test('csv_from from string (\\n)', async () =>
  expected_csv(
    csv_from({}, csv_str_n) ))

suite.test('csv_from from string (\\r)', async () =>
  expected_csv(
    csv_from({}, csv_str_r) ))



suite.test('csv_iter from string (\\r\\n)', async () =>
  expected_csv(
    [... csv_iter({}, csv_str_rn)] ))

suite.test('csv_iter from string (\\n)', async () =>
  expected_csv(
    [... csv_iter({}, csv_str_n)] ))

suite.test('csv_iter from string (\\r)', async () =>
  expected_csv(
    [... csv_iter({}, csv_str_r)] ))



suite.test('csv_async_iter from string (\\r\\n)', async () =>
  expected_csv( arr_from_async(
    csv_async_iter({}, csv_str_rn) )))

suite.test('csv_async_iter from string (\\n)', async () =>
  expected_csv( arr_from_async(
    csv_async_iter({}, csv_str_n) )))

suite.test('csv_async_iter from string (\\r)', async () =>
  expected_csv( arr_from_async(
    csv_async_iter({}, csv_str_r) )))

suite.test('csv_async_iter from Promise<string>', async () =>
  expected_csv( arr_from_async(
    csv_async_iter({}, Promise.resolve(csv_str_rn)) )))


export {suite as suite_csv_string, suite as default}

