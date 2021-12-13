import {bareuvu, assert} from 'bareuvu'
import basic_rptr from 'bareuvu/esm/rptr/basic.mjs'
import suite_main from './simple.js'

import {csv_from, csv_async_iter, table_as_json} from 'csv-iter-parse'
import {arr_from_async} from './_utils.js'

import {createReadStream} from 'node:fs'
import {open as fsp_open} from 'node:fs/promises'
import csv_spectrum from 'csv-spectrum'

suite_main.suite('NodeJS streams', suite => {
  suite.test('simple.csv from fs.createReadStream', async t => {
    let expected_table = [
      ['a', 'b', 'c'], 
      ['1', '2', '3'], 
    ]

    let aiter_rows = csv_async_iter(
      createReadStream('./test/csv/simple.csv'))

    let table = await arr_from_async(aiter_rows)
    t.assert.equal(table, expected_table)
  })

  suite.test('simple.csv from fs.createReadStream("utf-8")', async t => {
    let expected_table = [
      ['a', 'b', 'c'], 
      ['1', '2', '3'], 
    ]

    let aiter_rows = csv_async_iter(
      createReadStream('./test/csv/simple.csv',
        {encoding: "utf-8"}))

    let table = await arr_from_async(aiter_rows)
    t.assert.equal(table, expected_table)
  })

  suite.test('simple.csv from fs/promises open().createReadStream', async t => {
    let expected_table = [
      ['a', 'b', 'c'], 
      ['1', '2', '3'], 
    ]

    let fh = await fsp_open('./test/csv/simple.csv')
    let aiter_rows = csv_async_iter(
      fh.createReadStream())

    let table = await arr_from_async(aiter_rows)
    t.assert.equal(table, expected_table)
  })

  suite.test('simple.csv from fs/promises open().readableWebStream', async t => {
    let expected_table = [
      ['a', 'b', 'c'], 
      ['1', '2', '3'], 
    ]

    let fh = await fsp_open('./test/csv/simple.csv')
    let aiter_rows = csv_async_iter(
      fh.readableWebStream())

    let table = await arr_from_async(aiter_rows)
    t.assert.equal(table, expected_table)
  })
})


let spectrum = await new Promise((resolve, reject) =>
  csv_spectrum((err, data) =>
    err ? reject(err) : resolve(data)))

spectrum && suite_main.suite('csv-spectrum', async suite => {
  let skip = `
    escaped_quotes
    quotes_and_newlines
    json
    `.split(/\s+/)

  let only = `
    `.split(/\s+/)

  for (let {name, csv, json} of spectrum) {
    csv = csv.toString('utf-8')
    json = JSON.parse(json.toString('utf-8'))
    {
      for (let json_row of json) {
        for (let k in json_row) {
          let v = json_row[k]
          if (/[\r\n]/.test(v)) {
            json_row[k] = v.split(/$\r?\n?/m)
          }
        }
      }
    }

    let spectrum_test = t => {
      let table = csv_from(csv)
      let obj = table_as_json(table)
      try {
        t.assert.equal(obj, json)
      } catch (err) {
        console.log({name, obj, json, csv})
        throw err
      }
    }

    if (only.includes(name))
      suite.test.only(name, spectrum_test)
    else if (skip.includes(name))
      suite.test.skip(name, spectrum_test)
    else
      suite.test(name, spectrum_test)
  }
})



let tid = setTimeout(Boolean, 15000) // keep nodejs open during async

await suite_main.run_main(basic_rptr, {process, assert})

tid = clearTimeout(tid)
