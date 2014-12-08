var d3 = require('d3');

function category(d){ return d[0];}
function value(d){ return d[1];}
function c(f1, f2){
    return function(){
        return f1(f2.apply(this, arguments));
    };
}

exports.dot = function(){
    var width = 1280,
        top = 75,
        bottom = 130,
        left = 165,
        right = 190,
        xAxisTop = 360;

    function chart(selection){
        var data = selection.datum(),
            categories = data.map(category),
            color = d3.scale.linear()
                .domain([0, categories.length])
                .range(['hsl(0,100%,70%)', 'hsl(360,100%,70%)'])
                .interpolate(d3.interpolateString),
            x = d3.scale.ordinal().domain(categories).rangeBands([left, width - right], 0.3, 0.5),
            y = d3.scale.linear().domain([0, 100]).range([xAxisTop - 45, top]),
            xAxis = d3.svg.axis().scale(x),
            yAxis = d3.svg.axis().scale(y).orient('left').ticks(4);

        selection.attr('viewBox', '0 0 ' + width + ' 515')
                .attr('preserveAspectRatio', 'xMidYMid meet')
                .attr('width', '100%');

        selection.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', 'point')
            .attr('r', '4')
            .attr('cy', c(y, value))
            .attr('cx', c(function(d){ return x(d) + x.rangeBand()/2;}, category));

        selection.append('g').attr('class', 'y axis')
            .attr('transform', 'translate(' + left + ',0)')
            .call(yAxis);

        selection.append('g').attr('class', 'x axis')
            .attr('transform', 'translate(0,' + xAxisTop + ')')
            .call(xAxis);

        selection.append('defs')
            .append('filter')
            .attr('id', 'myGaussianBlur')
            .append('feGaussianBlur')
            .attr('in', 'SourceGraphic')
            .attr('stdDeviation', 15);


        selection
            .append('g')
            .style('filter', 'url(#myGaussianBlur)')
            .selectAll('ellipse')
            .data(data)
            .enter()
            .append('ellipse')
            .style('fill-opacity', 0.6)
            .style('fill', function(d, i){ return color(i);})
            .attr('cy', c(y, value))
            .attr('cx', c(function(d){ return x(d) + x.rangeBand()/2;}, category))
            .attr('rx', '75')
            .attr('ry', '100');
    }
    return chart;
};
