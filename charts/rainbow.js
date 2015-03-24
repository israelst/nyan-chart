var d3 = require('d3'),
    util = require('../util'),
    inc = util.inc,
    index = util.arg(1),
    c = util.c;

exports.rainbow = function (x, y, color, category, value, data){
    return function(selection){
        var ry = d3.max(y.range()),
            filterId = 'nyanBlur',
            spots = selection.select('g.spots');

        if(selection.select('#' + filterId).size() === 0){
            selection.select('defs')
                .append('filter').attr('id', filterId)
                .append('feGaussianBlur')
                    .attr('in', 'SourceGraphic')
                    .attr('stdDeviation', 80);
        }

        spots.style('filter', 'url(#' + filterId + ')')
            .selectAll('ellipse')
            .data(data, category)
            .enter()
            .append('ellipse')
            .attr('rx', x.rangeBand() * 2)
            .attr('ry', ry)
            .style('fill', 'transparent');

        /* This rect prevent spot truncation */
        spots.append('rect')
            .attr('class', 'placeholder')
            .attr('width', 1)
            .attr('height', 1);

        spots.selectAll('ellipse').transition()
            .style('fill', c(color, index))
            .attr('cy', c(inc(ry), y, value))
            .attr('cx', c(inc(x.rangeBand()/2), x, category));
    };
};


