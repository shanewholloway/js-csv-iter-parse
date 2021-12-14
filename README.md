# csv-iter-parse

A line-oriented CSV parser using iterables or async iterables.
Only the core CSV/TSV/DSV line parsing, where each returned row is an array of strings.
All interpreting of headers and data values are left to you.
 
Made for the modern JavaScript ecosystem. Constructed with ESM tree-shaking friendly modules, as well as pragmatic CommonJS and UMD packaging.

Inspired by how often I reach for Matthew Holt's [PapaParse](https://www.papaparse.com) library.

### Install

```bash
> npm install csv-iter-parse
```

### Use

##### CSV Array

```javascript
import {csv_from} from 'csv-iter-parse'

let csv_content = `\
name,value
first,bingo
second,bango
third,bongo
`

for (let row of csv_from(csv_content)) {
  for (let cell of row) {
    console.log(row)
  }
}
```

##### CSV Iterable

```javascript
import {csv_iter} from 'csv-iter-parse'

for (let row of csv_iter(csv_content)) {
  for (let cell of row) {
    console.log(row)
  }
}
```

##### CSV Async Iterable Streams

```javascript
import {csv_async_iter} from 'csv-iter-parse'

// async_csv_content can be a Web Response,
// or a Web ReadableStream,
// or a NodeJS readable stream
// or an async iterable
let async_csv_content = fetch('some-content.csv')

for await (let row of csv_async_iter(async_csv_content)) {
  for (let cell of row) {
    console.log(row)
  }
}
```

### Documentation

#### `csv_from()`, `tsv_from()` and `dsv_from()`
```typescript
function csv_from(iter_lines : iterable< string >) : array< array< string > >
function tsv_from(iter_lines : iterable< string >) : array< array< string > >
function dsv_from(dsv_options, iter_lines : iterable< string >) : array< array< string > >
```

Parses each CSV row of `iter_lines` into a returned array. Think `Array.from` CSV input.


#### `csv_iter()`, `tsv_iter()` and `dsv_iter()`
```typescript
function csv_iter(iter_lines : iterable< string >) : iterable< array< string > >
function tsv_iter(iter_lines : iterable< string >) : iterable< array< string > >
function dsv_iter(dsv_options, iter_lines : iterable< string >) : iterable< array< string > >
```

Parses each CSV row of `iter_lines` and yields it.

```javascript
// pseudo code
for (let line of iter_lines)
  yield csv_parse_row(line, ++n)
```

#### `csv_async_iter()`

```typescript
function csv_async_iter(aiter_lines : async_iterable< string >) : async_iterable< array< string > >
function tsv_async_iter(aiter_lines : async_iterable< string >) : async_iterable< array< string > >
function dsv_async_iter(dsv_options, aiter_lines : async_iterable< string >) : async_iterable< array< string > >
```

Awaits each new CSV row of `aiter_lines`, parses and yields it.
  
```javascript
// pseudo code
for await (let line of await aiter_lines)
  yield csv_parse_row(line, ++n)
```

##### Async iterable utilities

```typescript
async function * aiter_stream_lines(stream : async_iterable<string> | ReadableStream) : async_iterable<string>
async function * aiter_stream(stream : async_iterable<string> | ReadableStream) : async_iterable<string>
async function * aiter_lines(aiter_utf8 : async_iterable<string>) : async_iterable<string>
async function * aiter_rx_split(rx_split : regexp, aiter_utf8 : async_iterable<string>) : async_iterable<string>
```

- `aiter_stream_lines(stream)` returns composed `aiter_lines(aiter_stream(stream))`
- `aiter_stream(stream)` is an adapter for async iteration over a `ReadableStream`; defers to existing implementation if present.
- `aiter_lines(aiter_utf8)` returns composed `aiter_rx_split(/$\r?\n?/m, aiter_utf8)`
- `aiter_rx_split(rx_split, aiter_utf8)` buffers `aiter_utf8` and returns complete splits. e.g. complete lines.

#### `dsv_options`

```javascript
function as_dsv_options(dsv_options) : dsv_options

dsv_options = {
  delimiter: ',',
  quote: '"',
  escape: '""', // defaults to `${quote+quote}` which defaults to '""'
  missing_endquote({row, line, info, i0, cell}, fn_splice) {
    // optional callback when a CSV row is missing an endquote
    // i0 is starting index of quote cell content
    return fn_splice
  }
}
```
Standardizes `dsv_options` for consistent interpretation by other functions.

##### Per-CSV row parsing

- `function dsv_bind_parse_row(dsv_options) : dsv_parse_row`
  Retunrs a bound `dsv_parse_row` function for the given `dsv_options`.

- `function dsv_parse_row(line, info?) : array< string > | function(line,info)`
  Parses a line of DSV into an array of strings.
  If the row is continued via an unclosed quote, a closure to continue the parsing is returned.

- `csv_parse_row = dsv_bind_parse_row({delimiter: ',', quote: '"', escape: '"'})`
  Pre-bound for comma-seperated CSV row parsing.

- `tsv_parse_row = dsv_bind_parse_row({delimiter: '\t', quote: '"', escape: '"'})`
  Pre-bound for tab-seperated TSV row parsing.

