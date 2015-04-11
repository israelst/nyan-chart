var d3 = require('d3'),
    util = require('../util'),
    accessor = util.accessor,
    c = util.c,
    inc = util.inc,
    index = util.arg(1),
    p = util.p;


// TODO: Revisit the constructor, there is too many parameters, mind the default values
exports.rainbow = function (x, y, data, transitionConfig){
    function addFilter(selection, id){
        if(selection.select('#' + id).size() === 0){
            selection.select('defs')
                .append('filter').attr('id', id)
                .append('feGaussianBlur')
                    .attr('in', 'SourceGraphic')
                    .attr('stdDeviation', 80);
        }
    }

    function chart(spots){
        var ry = d3.max(y.range()),
            filterId = 'nyanBlur';

        addFilter(d3.select(spots.node().parentNode), filterId);

        spots.style('filter', 'url(#' + filterId + ')')
            .selectAll('ellipse')
            .data(data, chart.category())
            .enter()
            .append('ellipse')
            .attr('rx', x.rangeBand() * 2)
            .attr('ry', ry)
            .style('fill', c(chart.color(), index));

        /* This rect prevent spot truncation */
        if(spots.select('rect.placeholder').size() === 0){
            spots.append('rect')
                .attr('class', 'placeholder')
                .attr('width', 1)
                .attr('height', 1);
        }

        spots.selectAll('ellipse').transition()
            .call(transitionConfig)
            .style('fill', c(chart.color(), index))
            .attr('cy', c(inc(ry), y, chart.value()))
            .attr('cx', c(inc(x.rangeBand()/2), x, chart.category()));
    }

    var addAttr = accessor.bind(chart);

    addAttr('color', function(){ return '#fff';});
    addAttr('category', p(0));
    addAttr('value', p(1));

    return chart;
};


