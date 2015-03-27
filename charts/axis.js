var accessor = require('../util').accessor,
    I = require('../util').arg(0),
    d3 = require('d3');

exports.wordWrapping = function(){
    function axis(container){
        var foreignObject = container.selectAll('foreignObject')
                .data(axis.scale().domain());

        foreignObject.enter()
            .append('foreignObject')
            .attr('width', axis.scale().rangeBand())
            .attr('x', axis.scale())
            .attr('y', axis.tickPadding())
            .append('xhtml:div')
                .attr('class', 'wordwrapping-text')
                .text(I);

        foreignObject.attr('height', function(){
            return this.childNodes[0].clientHeight;
        });
    }

    accessor.call(axis, 'tickPadding');
    accessor.call(axis, 'scale');

    return axis;
};
