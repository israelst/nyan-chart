var assert = require('assert'),
    d3 = require('d3'),
    wordWrapping = require('../charts/axis').wordWrapping;

describe('WordWrapping', function(){
    var xAxis, categories, x, axisContainer;
    beforeEach(function(){
        xAxis = wordWrapping();
        categories = ['Category 1', 'Category 2', 'Category 3 with a big name'];
        x = d3.scale.ordinal().domain(categories).rangeBands([0, 100], 0.3, 0.5);
        axisContainer = d3.select('body').append('svg');
    });

    it('should set scale properly', function(){
        xAxis.scale(x);
        assert.equal(xAxis.scale(), x);
    });

    it('should append one foreignObject for each domain item', function(){
        function foreignObjects(){
            return axisContainer.selectAll('foreignObject');
        }
        assert.equal(foreignObjects().size(), 0);
        axisContainer.call(xAxis.scale(x));
        assert.equal(foreignObjects().size(), categories.length);
    });
    it('should use scale rangeBand as foreignObject width', function(){
        axisContainer.call(xAxis.scale(x));
        var foreignObjects = axisContainer.selectAll('foreignObject');
        assert.equal(foreignObjects.attr('width'), x.rangeBand());
    });
});
