# csv-iter-parse

A line-oriented CSV parse using iterables or async iterables.
 
Made for modern JavaScript ecosystem, includes only core CSV line parsing into cells.
Constructed with ESM tree-shaking friendly packaging, as well as pragmatic CommonJS and UMD packaging.

Inspired by how often I reach for Matthew Holt's [PapaParse](https://www.papaparse.com) library.

### Install

```bash
> npm install csv-iter-parse
```

### Use

##### CSV Array

```javascript
import {csv_from} from 'csv-iter-parse'

let csv_content : string | array<string> | iterator<string> = `\
name,value
first,bingo
second,bango
third,bongo
`

let csv_result : array< array< string > > =
  csv_from(csv_options, csv_content)

for (let row of csv_result) {
  for (let cell of row) {
    console.log(row)
  }
}
```

##### CSV Iterable

```javascript
import {csv_iter} from 'csv-iter-parse'

for (let row of csv_iter(csv_options, csv_content)) {
  for (let cell of row) {
    console.log(row)
  }
}
```

##### CSV Async iterable streams

```javascript
import {csv_async_iter} from 'csv-iter-parse'

let csv_content =
  fetch('some-content.csv')
  .then(req => res.body())

for await (let row of csv_async_iter(csv_options, csv_content)) {
  for (let cell of row) {
    console.log(row)
  }
}
```

### Documentation

##### `csv_from()`
```javascript
function csv_from(
    csv_options,
    iter_csv_lines,
  ) : array< array< string > >`
```

Parses each csv row of `iter_csv_lines` into a returned array, like `Array.from` but for CSV input.

##### `csv_iter()`
```javascript
function * csv_iter(
    csv_options,
    iter_csv_lines : iterator< array< string >>,
  ) : iterator< array< string >>`
```

Parses each csv row of `iter_csv_lines` and yields it.

```javascript
// pseudo code
for (let line of iter_csv_lines)
  yield csv_parse_row(line, ++n)
```

##### `csv_async_iter()`

```javascript
async function * csv_async_iter(
    csv_options,
    aiter_csv_lines : promse< async_iterator< string > >
  ) : async_iterator< array< string >`
```

Awaits each new csv row of `aiter_csv_lines`, parses and yields it.
  
```javascript
// pseudo code
for await (let line of await aiter_csv_lines)
  yield csv_parse_row(line, ++n)
```

##### `csv_options`

```javascript
function as_csv_options(csv_options) : csv_options

csv_options = {
  delimiter: ',',
  quote: '"',
  escape: '"', // defaults to `${quote}` which defaults to '"'
  missing_endquote({line, i0, len, info}) {
    // optional callback when a CSV row is missing an endquote
  }
}
```
Standardizes `csv_options` for consistent interpretation by other functions.

#### Per-CVS row parsing

- `function csv_parse_row(line, info?) : array< string >`

- `function csv_bind_parse_row(csv_options) : csv_parse_row`
  where `csv_parse_row` accepts a single line string and returns an array of string cells.

