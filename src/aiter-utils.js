
export async function * aiter_stream(stream, no_default) {
  // adapter for ReadableStream while asyncIterator is finalized
  if (!no_default && stream[Symbol.asyncIterator])
    return yield * stream

  let reader = stream.getReader()
  try {
    for(;;) {
      let r = await reader.read()
      if (r.done)
        return r.value
      yield r.value
    }
  } finally {
    reader.releaseLock()
  }
}

export async function * aiter_rx_split(rx_split, aiter_utf8) {
  let buf = ''
  let utf8 = new TextDecoder('utf8')
  for await (let sz of aiter_utf8) {
    if ('string' !== typeof sz)
      sz = utf8.decode(sz)

    let parts = (buf + sz).split(rx_split)
    buf = parts.pop()
    for (let each of parts)
      yield each
  }

  if (buf)
    yield buf
}

export const aiter_lines = aiter_utf8 =>
  aiter_rx_split(/$\r?\n?/m, aiter_utf8)

export const aiter_stream_lines = stream =>
  aiter_lines(aiter_stream(stream))

