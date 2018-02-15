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
      expect(lens.a.get()).to.equal(1)
      expect(lens.b.get()).to.equal(2)
      expect(lens.c.get()).to.equal(3)
    })
    it('Should create a lens for a object of depth 2', function() {
      var state = {
        a: {
          b: 1,
          c: 2
        }
      }
      var lens = lenscrafter(state)
      expect(lens.b.get()).to.equal(1)
      expect(lens.c.get()).to.equal(2)
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
      expect(lens.c.get()).to.equal(2)
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
      expect(lens.m.get()).to.equal('q')
      expect(lens.d.get()).to.equal(1)
      expect(lens.c.get()).to.equal(2)
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
      expect(lens.m.get(currentState)).to.equal('q')
      expect(lens.d.get(currentState)).to.equal(1)
      expect(lens.c.get(currentState)).to.equal(500)
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
      const newState = lens.a.set(10, state)
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
      const newState = lens.b.set(10, state)
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
      const newState = lens.c.set(10, state)
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
      const newState = lens.m.set('sadads', state)
      expect(newState.a.b.t.m).to.equal('sadads')
    })
  })
})