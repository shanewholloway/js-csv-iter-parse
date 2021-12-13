import {bareuvu, assert} from 'bareuvu'

export const suite_root = bareuvu()

export async function expected_table(table_result) {
  table_result = await table_result
  try {
    return assert.equal(table_result, expected_table_result)
  } catch (err) {
    console.dir({ans: table_result, exp:expected_table_result}, {depth: 9})
    throw err
  }
}

export const expected_table_result = [
  ['title', 'name'],
  ['test title 01', 'test name 01'],
  ['', 'test name 02'],
  ['test title aa', 'test name aa'],
  ['test title bb', 'test name bb'],
  ['test title cc', 'test name cc'],
  [['test ', 'title dd'], 'test name dd'],
  //[['test title', ' ee'], ['test ', 'name ee']],
]

export const source_array = [
  ['title','name'],
  ['test title 01','test name 01'],
  ['','test name 02'],
  ['test title aa','"test name aa"'],
  ['"test title bb"','test name bb'],
  ['"test title cc"','"test name cc"'],

  ['"test '],
  ['title dd"','test name dd'],

  /*
  ['"test title'],
  [' ee"','"test '],
  ['name ee"'],
  */
];

