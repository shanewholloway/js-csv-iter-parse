import {csv_async_iter, row_trim, table_rows} from 'csv-iter-parse'

// CSV async iterable can be a Web Response,
// or a Web ReadableStream,
// or a NodeJS readable stream
// or an async iterable
async function * mock_csv_fetch() {
  yield await 'name,value'
  yield await 'first,bingo'
  yield await 'second,bango'
  yield await 'third,bongo'
}

console.group('CSV by row array')
for await (let row of csv_async_iter(mock_csv_fetch())) {
  console.group('row:', row)
  for (let cell of row)
    console.log('cell:', cell)
  console.groupEnd()
}
console.groupEnd()
