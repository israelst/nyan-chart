var d3 = require('d3'),
    util = require('../util'),
    inc = util.inc,
    index = util.arg(1),
    c = util.c;


// TODO: Revisit the constructor, there is too many parameters, mind the default values
exports.rainbow = function (x, y, color, category, value, data, transitionConfig){
    function addFilter(selection, id){
        if(selection.select('#' + id).size() === 0){
            selection.select('defs')
                .append('filter').attr('id', id)
                .append('feGaussianBlur')
                    .attr('in', 'SourceGraphic')
                    .attr('stdDeviation', 80);
        }
    }
    return function(selection){
        var ry = d3.max(y.range()),
            filterId = 'nyanBlur',
            spots = selection.select('g.spots');

        addFilter(selection, filterId);

        spots.style('filter', 'url(#' + filterId + ')')
            .selectAll('ellipse')
            .data(data, category)
            .enter()
            .append('ellipse')
            .attr('rx', x.rangeBand() * 2)
            .attr('ry', ry)
            .style('fill', c(color, index));

        /* This rect prevent spot truncation */
        spots.append('rect')
            .attr('class', 'placeholder')
            .attr('width', 1)
            .attr('height', 1);

        spots.selectAll('ellipse').transition()
            .call(transitionConfig)
            .style('fill', c(color, index))
            .attr('cy', c(inc(ry), y, value))
            .attr('cx', c(inc(x.rangeBand()/2), x, category));
    };
};


