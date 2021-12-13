
export async function * aiter_stream(stream) {
  // adapter for ReadableStream while asyncIterator is finalized
  if (stream[Symbol.asyncIterator])
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
  for await (let sz of aiter_utf8) {
    let lst = (buf + sz).split(rx_split)
    buf = lst.pop()
    for (let line of lst)
      yield line
  }

  if (buf)
    yield buf
}

export const aiter_lines = aiter_utf8 =>
  aiter_rx_split(/$\r?\n?/m, aiter_utf8)

export const aiter_text_stream = stream =>
  aiter_lines(aiter_stream(stream))
