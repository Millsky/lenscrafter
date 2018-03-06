/**
 * Created by kylemills on 1/10/18.
 */
import { chain, toPairs, fromPairs, map, lens, assoc, propOr, compose, view, set } from 'ramda'

const createGetterSetterPairs = customLens => ({
  get: state => view(customLens, state),
  set: (value, state) => set(customLens, value, state),
  lens: customLens
})




function flatten(input, reference, output) {
  output = output || {}
  for (var key in input) {
    var value = input[key]
    key = reference ? reference + '.' + key : key
    if (typeof value === 'object' && value !== null) {
      output[key] = value
      flatten(value, key, output)
    } else {
      output[key] = value
    }
  }
  return output
}


/*
 * Given a state create all the neccessary selectors irrespective of the shape.
 * @param state
 * @return {{}}
 */
function createLensForState(state) {
  // Flatten the state, keys become dot props
  const flatState = flatten(state)
  console.log(flatState)
  // create blank selectors object to populate
  return Object.keys(flatState).reduce((object, key) => {
    // check if key is a dot prop
    const fallBackState = flatState[key]
    const customLens = key.split('.')
      // Create a lens for the property
      .map(objectProperty =>
        lens(propOr(fallBackState, objectProperty), assoc(objectProperty)))
      // create a composed lens
      .reduce((pLens, cLens) => compose(pLens, cLens))
    // Add getter setter at dynamic key
    object[key.split('.')[key.split('.').length - 1]] = createGetterSetterPairs(customLens)
    return object
  }, {})
}

export default {
  createLensForState
}
