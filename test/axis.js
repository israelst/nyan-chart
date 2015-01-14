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

    it('should set tickPadding properly', function(){
        xAxis.tickPadding(45);
        assert.equal(xAxis.tickPadding(), 45);
    });

    it('should append one foreignObject for each domain item', function(){
        function foreignObjects(){
            return axisContainer.selectAll('foreignObject');
        }
        assert.equal(foreignObjects().size(), 0);
        axisContainer.call(xAxis.scale(x));
        assert.equal(foreignObjects().size(), categories.length);
    });
    it('should set y from tickPadding', function(){
        xAxis.scale(x).tickPadding(45);
        axisContainer.call(xAxis);
        var foreignObjects = axisContainer.selectAll('foreignObject')[0],
            ys = foreignObjects.map(function(foreignObject){
                return d3.select(foreignObject).attr('y');
            });
        assert.deepEqual(ys, [45, 45, 45]);
    });
    describe('foreignObject', function(){
        beforeEach(function(){
            axisContainer.call(xAxis.scale(x));
        });
        it('should use scale rangeBand as width', function(){
            var foreignObjects = axisContainer.selectAll('foreignObject');
            assert.equal(foreignObjects.attr('width'), x.rangeBand());
        });
        it('should contains html div identifiable by class', function(){
            var divs = axisContainer.selectAll('foreignObject > div.wordwrapping-text');
            assert.equal(divs.node().namespaceURI, 'http://www.w3.org/1999/xhtml');
            assert.equal(divs.node().tagName, 'DIV');
            assert.equal(divs.node().className, 'wordwrapping-text');
        });
        it('should contains a div with category name', function(){
            var divs = axisContainer.selectAll('foreignObject > div')[0],
                texts = divs.map(function(div){ return div.textContent;});
            assert.deepEqual(texts, categories);
        });
        it('should vary x attr according to scale', function(){
            var foreignObjects = axisContainer.selectAll('foreignObject')[0],
                xs = foreignObjects.map(function(foreignObject){
                    return d3.select(foreignObject).attr('x');
                });
            assert.deepEqual(xs, x.range());
        });
        it('should have enough height to show the text', function(){
            var foreignObjects = axisContainer.selectAll('foreignObject');
            foreignObjects.each(function(value){
                foreignObject = d3.select(this);
                // Mock clientHeight value, the important thing here is vary according to value length to simulate browser wordwrapping
                foreignObject.select('div').node().clientHeight = value.length;
                axisContainer.call(xAxis.scale(x));
                var foreignObjectHeight = foreignObject.attr('height'),
                    divHeight = foreignObject.select('div').node().clientHeight;
                assert.equal(foreignObjectHeight, divHeight);
            });
        });
    });
});
