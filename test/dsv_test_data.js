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

export let expected_table_result = [
  ['title', 'name'],
  ['test title 01', 'test name 01'],
  ['', 'test name 02'],
  ['test title 03'],

  ['test title 04',''],
  ['  test title 05  ','  test name 05  '],
  [' ','  test name 06  ', ' '],

  ['test title aa', 'test name aa'],
  ['test title bb', 'test name bb'],
  ['test title cc', 'test name cc'],

  [['test ', 'title dd'], 'test name dd'],
  [['test title', ' ee'], ['test ', 'name ee']],

  ['test title , ff', 'test name \t ff'],

  [ 'test title gg', ['test ', 'name , \t continued', 'gg ended'] ],
]

export let source_array = [
  ['title','name'],
  ['test title 01','test name 01'],
  ['','test name 02'],
  ['test title 03'],

  ['test title 04',''],
  ['  test title 05  ','  test name 05  '],
  [' ','  test name 06  ', ' '],

  ['test title aa','"test name aa"'],
  ['"test title bb"','test name bb'],
  ['"test title cc"','"test name cc"'],

  ['"test '],
  ['title dd"','test name dd'],

  ['"test title'],
  [' ee"','"test '],
  ['name ee"'],

  ['"test title , ff"', '"test name \t ff"'],

  ['"test title gg"', '"test '],
  ['name , \t continued'],
  ['gg ended"'],
];

