var assert = require('assert'),
    d3 = require('d3'),
    wordWrapping = require('../charts/axis').wordWrapping;

describe('WordWrapping', function(){
    var xAxis, categories, x;
    beforeEach(function(){
        xAxis = wordWrapping();
        categories = ['Category 1', 'Category 2', 'Category 3 with a big name'];
        x = d3.scale.ordinal().domain(categories).rangeBands([0, 100], 0.3, 0.5);
    });

    it('should set scale properly', function(){
        xAxis.scale(x);
        assert.equal(xAxis.scale(), x);
    });
});
