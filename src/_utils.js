export const _is_fn = v =>
  'function' === typeof v

export function _find_fn(v, ...keys) {
  for (let k of keys)
    if ('function' === typeof v[k])
      return k
}
