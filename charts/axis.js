var accessor = require('../util').accessor;

exports.wordWrapping = function(){
    function axis(container){
        var foreignObject = container.selectAll('foreignObject')
                .data(axis.scale().domain())
                .enter()
                .append('foreignObject')
                .attr('width', axis.scale().rangeBand())
                .attr('x', axis.scale())
                .attr('y', axis.tickPadding()),
            div = foreignObject.append('xhtml:div')
                .attr('class', 'wordwrapping-text')
                .text(function(d){ return d;}).node();
        foreignObject.attr('height', div.clientHeight);
    }

    accessor.call(axis, 'tickPadding');
    accessor.call(axis, 'scale');

    return axis;
};
