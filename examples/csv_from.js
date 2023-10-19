import {csv_from, row_trim, table_rows} from 'csv-iter-parse'

let csv_content = `
name,value
first,bingo
second,bango
third,bongo
`

console.group('CSV by row array')
for (let row of csv_from(csv_content)) {
  console.group('row:', row)
  for (let cell of row)
    console.log('cell:', cell)
  console.groupEnd()
}
console.groupEnd()
