export function * as_iter(iterable) {
  for (let e of iterable)
    yield e
}

export async function * as_async_iter(iterable) {
  iterable = await iterable
  for await (let e of iterable)
    yield await e
}

export async function arr_from_async(iterable) {
  let res = []
  iterable = await iterable
  for await (let e of iterable)
    res.push(e)
  return res
}

