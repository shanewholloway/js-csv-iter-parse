import {bareuvu, assert} from 'bareuvu'

export const suite_root = bareuvu().with_ctx({assert})

export async function expected_table(table_result) {
  table_result = await table_result
  try {
    return assert.equal(table_result, expected_table_result)
  } catch (err) {
    console.dir({ans: table_result, exp:expected_table_result}, {depth: 9})
    throw err
  }
}

export const tc_simple = {
  src: [
    ['title','name'],
    ['test title 01','test name 01'],
    ['','test name 02'],
    ['test title 03'],
  ], table: [
    ['title', 'name'],
    ['test title 01', 'test name 01'],
    ['', 'test name 02'],
    ['test title 03'],
  ]}

export const tc_whitespace = {
  src: [
    ['test title 04',''],
    ['  test title 05  ','  test name 05  '],
    [' ','  test name 06  ', ' '],

  ], table: [
    ['test title 04',''],
    ['  test title 05  ','  test name 05  '],
    [' ','  test name 06  ', ' '],
  ]}

export const tc_quotes = {
  src: [
    ['test title aa','"test name aa"'],
    ['"test title bb"','test name bb'],
    ['"test title cc"','"test name cc"'],
  ], table: [
    ['test title aa', 'test name aa'],
    ['test title bb', 'test name bb'],
    ['test title cc', 'test name cc'],
  ]}

export const tc_split_first = {
  src: [
    ['"test '],
    ['title dd"','test name dd'],
  ], table: [
    [['test ', 'title dd'], 'test name dd'],
  ]}

export const tc_split_both = {
  src: [
    ['"test title'],
    [' ee"','"test '],
    ['name ee"'],
  ], table: [
    [['test title', ' ee'], ['test ', 'name ee']],
  ]}

export const tc_dsv_chars = {
  src: [
    ['"test title , ff"', '"test name \t ff"'],
  ], table: [
    ['test title , ff', 'test name \t ff'],
  ]}

export const tc_split_multi = {
  src: [
    ['"test title gg"', '"test '],
    ['name , \t continued'],
    ['gg ended"'],
  ], table: [
    [ 'test title gg', ['test ', 'name , \t continued', 'gg ended'] ],
  ]}


export let all_tc = [
  tc_simple,
  tc_whitespace,
  tc_quotes,
  tc_split_first,
  tc_split_both,
  tc_dsv_chars,
  tc_split_multi,
]

export let source_array =
  all_tc.flatMap(e => e.src)

export let expected_table_result =
  all_tc.flatMap(e => e.table)

