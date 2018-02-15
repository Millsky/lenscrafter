Lens Crafter
====================

## A Micro Library for immutable and safe state access 

# Introduction

This library aims to abstract away the manual creation of lenses or state selectors. In [redux](https://redux.js.org/) we might have an initial state that looks like the following: 
  
 ```$javascript
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

```$javascript
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

```$javascript
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

```$javascript
import lenscrafter as craft from 'lenscrafter'
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
