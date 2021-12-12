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

```javascript
import {csv_iter} from 'csv-iter-parse'

let csv_content : string | Array<string> | iterator<string>

for (let row of csv_iter(csv_options, csv_content)) {
  for (let cell of row) {
    console.log(row)
  }
}
```

##### Async iterable streams

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

- `function * csv_iter(csv_options, iterable_content : iterator<string>)`
  Parses each csv row of `iterable_content` and yields it.

  ```javascript
  for (let line of iterable_content)
    yield csv_parse_row(line, ++n)
  ```

- `async function * csv_async_iter(csv_options, async_iterable_content : promse<async_iterator<string>>)`
  Awaits each new csv row of `async_iterable_content`, parses and yields it.
  
  ```javascript
  for await (let line of await async_iterable_content)
    yield csv_parse_row(line, ++n)
  ```

- `function as_csv_options(csv_options) : csv_options`
  Standardizes `csv_options` for consistent interpretation by other functions.

  ```javascript
  csv_options = {
    delimiter: ',',

    quote: '"',

    escape: '"', // defaults to `${quote}` which defaults to '"'

    missing_endquote({line, i0, len, info}) {
      // optional callback when a CSV row is missing an endquote
    }
  }
  ```

#### Per-CVS row parsing

- `csv_parse_row = bind_parse_row() : csv_row(line, info)`

- `function csv_bind_parse_row(csv_options) : csv_row`
  where `csv_row` accepts a single line string and returns an array of string cells.

  `function csv_row(line, info?) : Array<string>`

