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
    describe('foreignObject', function(){
        beforeEach(function(){
            axisContainer.call(xAxis.scale(x));
        });
        it('should use scale rangeBand as width', function(){
            var foreignObjects = axisContainer.selectAll('foreignObject');
            assert.equal(foreignObjects.attr('width'), x.rangeBand());
        });
        it('should contains html body', function(){
            var body = axisContainer.selectAll('foreignObject > body');
            assert.equal(body.node().namespaceURI, 'http://www.w3.org/1999/xhtml');
            assert.equal(body.node().tagName, 'BODY');
        });
        it('should contains a div with category name', function(){
            var divs = axisContainer.selectAll('foreignObject > body > div')[0],
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
        xit('should have enough height to show the text', function(){
            // This test passes when height is not setted due the lack of clientHeight property while running without a browser. A better way to test it is needed
            var foreignObjects = axisContainer.selectAll('foreignObject')[0];
            foreignObjects.forEach(function(foreignObject){
                foreignObject = d3.select(foreignObject);
                var foreignObjectHeight = foreignObject.attr('height'),
                    divHeight = foreignObject.select('div').node().clientHeight;
                console.log(foreignObjectHeight, divHeight);
                assert.equal(foreignObjectHeight, divHeight);
            });

        });
    });
});
