/**
 * Created by kylemills on 1/10/18.
 */
import { lens, assoc, propOr, compose, view, set } from 'ramda'

const createGetterSetterPairs = customLens => ({
  get: state => view(customLens, state),
  set: (value, state) => set(customLens, value, state),
  lens: customLens
})

/*
 * Function to check if a given key has a duplicate child in the object
 * @param flatState - An object representing the partially flattened state
 * @param k - Key to check
 * @return {boolean}
 */
function hasDuplicateChild (flatState, k) {
  const keyList = Object.keys(flatState)
  let hasDuplicateChild = false
  let duplicateCount = 0
  for (let j = 0 ; j < keyList.length ; j++) {
    const currentKey = keyList[j]
    const splitKey = currentKey.split('.')
    if (splitKey[splitKey.length -1] === k) {
      duplicateCount += 1
      if (duplicateCount > 1) {
        hasDuplicateChild = true
      }
    }
  }
  return hasDuplicateChild
}


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
  // create blank selectors object to populate
  const selctorForAllProps = Object.keys(flatState).reduce((object, key) => {
    // check if key is a dot prop
    const fallBackState = flatState[key]
    const customLens = key.split('.')
      // Create a lens for the property
      .map(objectProperty =>
        lens(propOr(fallBackState, objectProperty), assoc(objectProperty)))
      // create a composed lens
      .reduce((pLens, cLens) => compose(pLens, cLens))
    // Add getter setter at dynamic key
    const prop = key.split('.')[key.split('.').length - 1]
    // Check if has parent
    const hasParent = key.indexOf('.') > -1
    // If has parent and child is a dupe
    if (hasDuplicateChild(flatState, prop) && hasParent) {
      // Create nested prop for prop-er resolution
      const parentProp = key.split('.')[key.split('.').length - 2]
      object.props[parentProp][prop] = createGetterSetterPairs(customLens)
    } else {
      object.props[prop] = createGetterSetterPairs(customLens)
    }

    return object
  }, {
    props: {}
  })

  const addListProps = Object.assign({
    listProps: Object.keys(selctorForAllProps.props)
  }, selctorForAllProps)

  addListProps.getMany = (propsArray, state) => {
    return propsArray.reduce((accum, prop) => {
      return Object.assign({
        [prop]: addListProps.props[prop].get(state)
      }, accum)
    }, {})
  }

  addListProps.wrapAll = (lens) => {
    const newProps = Object.keys(addListProps.props).reduce((accum, prop) => {
      return Object.assign({
        [prop]: createGetterSetterPairs(compose(lens, addListProps.props[prop].lens))
      }, accum)
    }, {})
    return {
      props: newProps,
    }
  }

  addListProps.getInitialized = () => state

  return addListProps
}

export default {
  createLensForState
}
