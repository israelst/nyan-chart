var accessor = require('../util').accessor,
    d3 = require('d3');

exports.wordWrapping = function(){
    function axis(container){
        var foreignObject = container.selectAll('foreignObject')
                .data(axis.scale().domain())
                .enter()
                .append('foreignObject')
                .attr('width', axis.scale().rangeBand())
                .attr('x', axis.scale())
                .attr('y', axis.tickPadding()),
            divs = foreignObject.append('xhtml:div')
                .attr('class', 'wordwrapping-text')
                .text(function(d){ return d;});
        divs.each(function(v){
            d3.select(this.parentNode).attr('height', this.clientHeight);
        });
    }

    accessor.call(axis, 'tickPadding');
    accessor.call(axis, 'scale');

    return axis;
};
