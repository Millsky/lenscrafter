/**
 * Created by kylemills on 1/10/18.
 */
import { chain, toPairs, fromPairs, map, lens, assoc, propOr, compose, view, set } from 'ramda'

const createGetterSetterPairs = customLens => ({
  get: state => view(customLens, state),
  set: (value, state) => set(customLens, value, state)
})

const flattenObj = (obj) => {
  const go = obj_ => chain(([k, v]) => {
    if (Object.prototype.toString.call(v) === '[object Object]') {
      return map(([k_, v_]) => [`${k}.${k_}`, v_], go(v))
    }
    return [[k, v]]
  }, toPairs(obj_))

  return fromPairs(go(obj))
}

/*
 * Given a state create all the neccessary selectors irrespective of the shape.
 * @param state
 * @return {{}}
 */
function createLensForState(state) {
  // Flatten the state, keys become dot props
  const flatState = flattenObj(state)
  // create blank selectors object to populate
  const selectors = {}
  Object.keys(flatState).forEach((key) => {
    // check if key is a dot prop
    const fallBackState = flatState[key]
    const customLens = key.split('.')
      // Create a lens for the property
      .map(objectProperty =>
        lens(propOr(fallBackState, objectProperty), assoc(objectProperty)))
      // create a composed lens
      .reduce((pLens, cLens) => compose(pLens, cLens))
    // Add getter setter at dynamic key
    selectors[key[key.length - 1]] = createGetterSetterPairs(customLens)
    return selectors
  })
  return selectors
}

export default {
  createLensForState
}
