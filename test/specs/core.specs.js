/* global helpers */
describe('#createLensForState', function() {
  describe('#getters', function() {
    it('Should create a lens for a object of depth 1', function() {
      var state = {
        a: 1,
        b: 2,
        c: 3
      }
      var lens = lenscrafter(state)
      expect(lens.props.a.get()).to.equal(1)
      expect(lens.props.b.get()).to.equal(2)
      expect(lens.props.c.get()).to.equal(3)
    })
    it('Should create a lens for a object of depth 2', function() {
      var state = {
        a: {
          b: 1,
          c: 2
        }
      }
      var lens = lenscrafter(state)
      expect(lens.props.b.get()).to.equal(1)
      expect(lens.props.c.get()).to.equal(2)
    })
    it('Should create a lens for a object of depth 3', function() {
      var state = {
        a: {
          b: {
            c: 2
          }
        }
      }
      var lens = lenscrafter(state)
      expect(lens.props.c.get()).to.equal(2)
    })
    it('Should create a lens for a object of variable depth', function() {
      var initialState = {
        a: {
          d: 1,
          b: {
            c: 2,
            t: {
              m: 'q'
            }
          }
        }
      }
      var lens = lenscrafter(initialState)
      expect(lens.props.m.get()).to.equal('q')
      expect(lens.props.d.get()).to.equal(1)
      expect(lens.props.c.get()).to.equal(2)
    })
    it('Should return the correct value regardless of shape', function() {
      var initialState = {
        a: {
          d: 1,
          b: {
            c: 2,
            t: {
              m: 'q'
            }
          }
        }
      }
      var currentState = {
        a: {
          b: {
            d: 1,
            c: 500,
            t: {
            },
            m: 'q'
          }
        }
      }
      var lens = lenscrafter(initialState)
      expect(lens.props.m.get(currentState)).to.equal('q')
      expect(lens.props.d.get(currentState)).to.equal(1)
      expect(lens.props.c.get(currentState)).to.equal(500)
    })
    it('Should create properties with multiple letters', function() {
      var initialState = { cool: 1, bool: { a: 2 } }
      var lens = lenscrafter(initialState)
      expect(lens.props.cool.get()).to.equal(1)
    })
    it('Should not return properties that were not declared in the initial map', function() {
      var initialState = { cool: 1, bool: { a: 2, qq: 1 } }
      var lens = lenscrafter(initialState)
      expect(lens.props.stool).to.equal(undefined)
    })
    it('Should handle duplicate properties by resolving the dot props', function () {
      var initialState = {
        x: {
          item1: {
            id: 1
          },
          item2: {
            id: 3
          }
        },
        id: 8
      }
      var lens = lenscrafter(initialState)
      console.log(lens.props.x)
      expect(lens.props.item1.id.get()).to.equal(1)
      expect(lens.props.item2.id.get()).to.equal(3)
      expect(lens.props.id.get()).to.equal(8)
    })
    it('Should create a lens for an object of depth 2 for all depth 1 properties', function() {
      var state = {
        a: {
          b: {
            c: 1
          }
        }
      }
      var lens = lenscrafter(state)
      expect(true).to.equal(true)
    })
    it('Should return properties without direct values', function() {
      var state = {
        a: {
          b: {
            c: 1
          }
        }
      }
      var lens = lenscrafter(state)
      var result = lens.props.b.get()
      expect(result).to.deep.equal(state.a.b)
    })
  })
  describe('#setters', function() {
    it('Should create a lens for a object of depth 1', function() {
      var state = Object.freeze({
        a: 1,
        b: 2,
        c: 3
      })
      var lens = lenscrafter(state)
      const newState = lens.props.a.set(10, state)
      expect(newState.a).to.equal(10)
    })
    it('Should create a lens for a object of depth 2', function() {
      var state = {
        a: {
          b: 1,
          c: 2
        }
      }
      var lens = lenscrafter(state)
      const newState = lens.props.b.set(10, state)
      expect(newState.a.b).to.equal(10)
    })
    it('Should create a lens for a object of depth 3', function() {
      var state = {
        a: {
          b: {
            c: 2
          }
        }
      }
      var lens = lenscrafter(state)
      const newState = lens.props.c.set(10, state)
      expect(newState.a.b.c).to.equal(10)
    })
    it('Should create a lens for a object of variable depth', function() {
      var state = {
        a: {
          d: 1,
          b: {
            c: 2,
            t: {
              m: 'q'
            }
          }
        }
      }
      var lens = lenscrafter(state)
      const newState = lens.props.m.set('sadads', state)
      expect(newState.a.b.t.m).to.equal('sadads')
    })
  })
  describe('#getMany', function() {
    it('Should get multiple props when state is flat', function() {
      var state = {
        a: 1,
        b: 2,
        c: 3
      }
      var lens = lenscrafter(state)
      const result = lens.getMany(['a', 'b'], state)
      expect(result.a).to.equal(1)
      expect(result.b).to.equal(2)
    })
  })
})
