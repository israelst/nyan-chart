var assert = require('assert'),
    util = require('../util'),
    accessor = util.accessor,
    arg = util.arg,
    p = util.p;

describe('accessor', function(){
    it('should create a method with the passed name', function(){
        var obj = {};
        assert.equal(typeof obj.propertyName, 'undefined');
        accessor.call(obj, 'propertyName');
        assert.equal(typeof obj.propertyName, 'function');
        assert.equal(typeof obj.propertyName(), 'undefined');
    });
    it('should return the default value', function(){
        var obj = {};
        accessor.call(obj, 'propertyName', 42);
        assert.equal(obj.propertyName(), 42);
    });
    it('should set value and return object', function(){
        var obj = {};
        accessor.call(obj, 'propertyName', 42);
        assert.equal(obj.propertyName(), 42);
        assert.equal(obj.propertyName('value'), obj);
        assert.equal(obj.propertyName(), 'value');
    });
});

describe('arg', function(){
    context('with no parameter', function(){
        it('should return a function that returns its arguments', function(){
            var f = arg();
            assert.deepEqual(f('first', 'second'), ['first', 'second']);
        });
    });
    context('receiving a existent index', function(){
        it('should return a function that returns the first argument', function(){
            var f = arg(0);
            assert.equal(f('first', 'second'), 'first');
        });
        it('should return a function that returns the second argument', function(){
            var f = arg(1);
            assert.equal(f('first', 'second'), 'second');
        });
    });
    context('receiving a inexistent index', function(){
        it('should return a function that returns undefined', function(){
            var f = arg(1);
            assert.equal(f('first'), undefined);
        });
    });
});

describe('p', function(){
    context('receiving an integer', function(){
        context('returns a function that receives an array relation and', function(){
            var strRelation = ['first', 'second'],
                numberRelation = [42, 3.14];
            it('should returns the first element', function(){
                var f = p(0);
                assert.equal(f(strRelation), 'first');
                assert.equal(f(numberRelation), 42);
            });
            it('should returns the second element', function(){
                var f = p(1);
                assert.equal(f(strRelation), 'second');
                assert.equal(f(numberRelation), 3.14);
            });
        });
    });
    context('receiving an string', function(){
        it('should return a function that returns the correspondent index', function(){
            var f = p('name');
            assert.equal(f({name: 'bob', age: 32}), 'bob');
        });
    });
});
