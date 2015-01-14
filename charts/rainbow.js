var d3 = require('d3'),
    util = require('../util'),
    inc = util.inc,
    c = util.c;

function index(d, i){ return i;}

exports.rainbow = function (x, y, color, category, value){
    return function(selection){
        var ry = d3.max(y.range()),
            data = selection.datum(),
            filter = selection.append('defs')
                .append('filter')
                .attr('id', 'myGaussianBlur');

        filter.append('feGaussianBlur')
            .attr('in', 'SourceGraphic')
            .attr('stdDeviation', 80);

        selection.append('g')
            .style('filter', 'url(#' + filter.attr('id') + ')')
            .selectAll('ellipse')
            .data(data)
            .enter()
            .append('ellipse')
            .style('fill', c(color, index))
            .attr('cy', c(inc(ry), y, value))
            .attr('cx', c(inc(x.rangeBand()/2), x, category))
            .attr('rx', x.rangeBand() * 2)
            .attr('ry', ry)
            .sort(function(a, b){ return value(b) - value(a);});
    };
};


