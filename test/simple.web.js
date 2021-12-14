import {bareuvu, assert} from 'bareuvu'
import basic_rptr from 'bareuvu/esm/rptr/basic.mjs'
import suite_main from './simple.js'

import {csv_async_iter} from 'csv-iter-parse'
import {arr_from_async} from './_utils.js'

suite_main.suite('web', suite => {
  suite.test('simple.csv from fetch', async t => {
    let expected_table = [
      ['a', 'b', 'c'], 
      ['1', '2', '3'], 
    ]

    let resp = await fetch('./test/csv/simple.csv')
    let aiter_rows = csv_async_iter(resp)

    let table = await arr_from_async(aiter_rows)
    t.assert.equal(table, expected_table)
  })

  suite.test('simple.csv from Response', async t => {
    let expected_table = [
      ['a', 'b', 'c'], 
      ['1', '2', '3'], 
    ]

    let resp = await fetch('./test/csv/simple.csv')
    let aiter_rows = csv_async_iter(resp.body)

    let table = await arr_from_async(aiter_rows)
    t.assert.equal(table, expected_table)
  })
})

await suite_main.run_main(basic_rptr, {})

