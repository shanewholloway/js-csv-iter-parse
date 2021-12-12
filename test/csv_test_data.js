import {bareuvu, assert} from 'bareuvu'

export const suite_root = bareuvu()

export async function expected_csv(csv_result) {
  csv_result = await csv_result
  return assert.equal(csv_result, expected_csv_result) }

export const expected_csv_result = [
  ['title', 'name'],
  ['test title 01', 'test name 01'],
  ['', 'test name 02'],
  ['test title aa', 'test name aa'],
  ['test title bb', 'test name bb'],
  ['test title cc', 'test name cc'],
]

export const csv_array = [
  'title,name',
  'test title 01,test name 01',
  ',test name 02',
  'test title aa,"test name aa"',
  '"test title bb",test name bb',
  '"test title cc","test name cc"',
];

export const csv_str_rn = csv_array.join('\r\n')
export const csv_str_n = csv_array.join('\n')
export const csv_str_r = csv_array.join('\r')

