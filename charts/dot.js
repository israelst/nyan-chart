var d3 = require('d3');

function category(d){ return d[0];}
function value(d){ return d[1];}
function index(d, i){ return i;}
function c(){
    return [].reduce.call(arguments, function(f1, f2){
        return function(){
            return f1(f2.apply(this, arguments));
        };
    });
}
function inc(increment){
    return function (value){
        return increment + value;
    };
}

function rainbow(x, y, color){
    return function(selection){
        var ry = d3.max(y.range()),
            data = selection.datum();

        selection.append('defs')
            .append('filter')
            .attr('id', 'myGaussianBlur')
            .append('feGaussianBlur')
            .attr('in', 'SourceGraphic')
            .attr('stdDeviation', 30);

        selection
            .append('g')
            .style('filter', 'url(#myGaussianBlur)')
            .selectAll('ellipse')
            .data(data)
            .enter()
            .append('ellipse')
            .style('fill-opacity', 0.4)
            .style('fill', c(color, index))
            .attr('cy', c(inc(ry), y, value))
            .attr('cx', c(inc(x.rangeBand()/2), x, category))
            .attr('rx', x.rangeBand() * 2.5)
            .attr('ry', ry)
            .sort(function(a, b){ return value(b) - value(a);});
    };
}

exports.dot = function(colors){
    var width = 1280,
        top = 75,
        left = 165,
        right = 190,
        xAxisTop = 360;

    function chart(selection){
        var data = selection.datum(),
            categories = data.map(category),
            color = d3.scale.linear(),
            x = d3.scale.ordinal().domain(categories).rangeBands([left, width - right], 0.3, 0.5),
            y = d3.scale.linear().domain([0, 100]).range([xAxisTop - 45, top]),
            xAxis = d3.svg.axis().scale(x),
            yAxis = d3.svg.axis().scale(y).orient('left').ticks(4);

        if(colors){
            color.domain(categories.map(index))
                .range(colors);
        }else{
            color.domain([0, categories.length])
                .range(['hsl(0,100%,70%)', 'hsl(360,100%,70%)'])
                .interpolate(d3.interpolateString);
        }

        selection.classed('nyan-chart-dot', true)
            .attr('viewBox', '0 0 ' + width + ' 515')
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .attr('width', '100%');

        selection.call(rainbow(x, y, color));

        selection.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', 'point')
            .attr('r', '6')
            .attr('cy', c(y, value))
            .attr('cx', c(inc(x.rangeBand()/2), x, category));

        selection.append('g').attr('class', 'y axis')
            .attr('transform', 'translate(' + left + ',0)')
            .call(yAxis);

        selection.append('g').attr('class', 'x axis')
            .attr('transform', 'translate(0,' + xAxisTop + ')')
            .call(xAxis);

    }
    return chart;
};
