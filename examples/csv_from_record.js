import {csv_from, row_trim, table_rows} from 'csv-iter-parse'

let csv_content = `
name,value
first,bingo
second,bango
third,bongo
`

console.group('CSV by row object')
for (let row of csv_from(csv_content, {as_row: table_rows()})) {
  console.log('row obj:', row)
}
console.groupEnd()
