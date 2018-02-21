Lens Crafter
====================

## A Micro Library for immutable and safe state access 

# Introduction

This library aims to abstract away the manual creation of lenses or state selectors. In [redux](https://redux.js.org/) 
we might have an initial state that looks like the following: 
  
 ```javascript
const initialState = {
  someList: [],
  someOtherProperty: 1,
  someNestedProperty: {
    someNestedValue: 1,
  },
}
```

Now we could access these properties a variety of ways. 

## Dot Properties - The naive approach

```javascript
// Normal Dot Properties
const someList = initialState.someList;
const someNestedValue = initialState.someList.someNestedValue;
```

```$javascript
// Object Destructuring
const { someList, someNestedProperty: { someNestedValue } } = initialState;
```

But what if the structure of our state changes? This approach will result in an undefined value which could break the UI.

## Selectors - A better approach

```javascript
import initialState from './state';
// function to retrieve value with fallback
const someNestedProperty = (state) => {
   const { someNestedProperty } = state;
   return state || initialState.someNestedProperty;
};

const someNestedValue = (state) => {
   const { someNestedValue } = someNestedProperty(state);
   return state || initialState.someNestedProperty.someNestedValue;
};
```

This approach is better as it creates a fallback at each level of nesting. But to get a value on state shape change 
the selectors need to be re-written. Also this does not provide a method by which we can set a value.

## Lenses - The Lenscrafter approach. 

> [A lens is a value that composes a getter and a setter function to produce a bidirectional view into a data structure.](https://docs.racket-lang.org/lens/lens-intro.html)

Given that we always know our initial state shape in redux we can create a lens for every property in an object.

```javascript
import lenscrafter from 'lenscrafter'
const initialState = {
  someList: [],
  someOtherProperty: 1,
  someNestedProperty: {
    someNestedValue: 1,
  },
}

const currentState = {
  someList: [],
  someOtherProperty: 1,
  someNestedProperty: {
    someNestedValue: 'New Value',
  },
}
// create getter and setter pairs for every property
const ourSpecialLens = lenscrafter(initialState);
ourSpecialLens.someNestedValue.get(/* state */); // 1
ourSpeicalLens.someNestedValue.get(currentState); // 'New Value'
```
using this method, the state retrieval process can be simplified into the one liner above. 
It can be ensured that when getting state, a value will always be returned as a fallback instead of `undefined`. 

# API 

## `const newLens = lenscrafter(object)`

`object`: The object that the lens should be created for.

### Usage

#### `newLens.property.get(object)`:
`object`: The object that the property should be retrieved for. If the object does not have the property it will fallback to the value of the property in the initial call to `lenscrafter`.

Returns the current value of the object at the specified property

#### `newLens.property.set(value, object)`: 
`value`: The value to set the property to.

`object`: The object for which the value should be set.

Returns a new object with the specified property updated to the specified value 

#### `newLens.property.lens`:
Returns the lens used for getting and setting, this is useful for further composition.

# Installation

To install: `npm install --save lenscrafter`

# Contributing

## Running tests

Run tests and compile the code with `node make`. For tests that also watch the files the `karma.conf` can be updated to
be `false` for single run, this is particularly useful for development. 

## Building the code

Code can be built using `node make minify`.


## Other useful commands

See the `scripts` in the package.json for other useful commands. 

