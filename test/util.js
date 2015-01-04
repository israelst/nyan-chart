var assert = require('assert'),
    accessor = require('../util').accessor;

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
