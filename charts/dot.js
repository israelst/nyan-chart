var d3 = require('d3'),
    util = require('../util'),
    inc = util.inc,
    c = util.c,
    accessor = util.accessor,
    balloon = require('./balloon'),
    wordWrapping = require('./axis').wordWrapping;

function category(d){ return d[0];}
function value(d){ return d[1];}
function index(d, i){ return i;}
function ceil(value){
    return Math.ceil(value/100) * 100;
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

        selection.append('g')
            .style('filter', 'url(#myGaussianBlur)')
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
}

exports.dot = function(colors){
    var _color = d3.scale.linear()
                    .range(['hsl(0, 100%, 60%)', 'hsl(360, 100%, 60%)'])
                    .interpolate(d3.interpolateString);

    function chart(selection){
        var data = selection.datum(),
            max = ceil(d3.max(data, value)),
            categories = data.map(category),
            x = d3.scale.ordinal().domain(categories).rangeBands([chart.left(), chart.width() - chart.right()], 0.3, 0.5),
            y = d3.scale.linear().domain([0, max]).range([chart.xAxisTop(), chart.top()]).clamp(true),
            yTickSize = y.range()[1] - y.range()[0],
            xAxis = wordWrapping().scale(x).tickPadding(45),
            yAxis = d3.svg.axis().scale(y).orient('left').tickValues(d3.range(0, max + 1, max/4));

            if(_color.range().length === 2){
                _color.domain([0, categories.length]);
            }else{
                _color.domain(d3.range(categories.length));
            }

        selection.classed('nyan-chart-dot', true)
            .attr('viewBox', '0 0 ' + chart.width() + ' 515')
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .attr('width', '100%');

        selection.call(rainbow(x, y, _color));

        selection.selectAll('path.ticks')
            .data(data)
            .enter()
            .append('path')
            .attr('class', 'ticks')
            .attr('d', function(d){
                var xPos = +c(inc(x.rangeBand()/2), x, category)(d),
                    margin = 12,
                    middleStop = Math.min(y(value(d)) + margin, y.range()[0]),
                    middleStart = Math.max(y(value(d)) - margin, y.range()[1]);
                return ('M' + xPos + ',' + y.range()[0] +
                        'V' + middleStop  +
                        'M' + xPos + ',' + middleStart +
                        'V' + y.range()[1]);
            });

        var points = selection.selectAll('g.point')
            .data(data)
            .enter()
            .append('g')
            .attr('class', 'point')
            .attr('transform', function(d){
                var dx = c(inc(x.rangeBand()/2), x, category)(d),
                    dy = c(y, value)(d);
                return 'translate(' + dx + ',' + dy + ')';
            });

        points.append('circle').attr('r', 6);

        points.call(balloon.tooltip(value, c(_color, index)));

        selection.append('g').attr('class', 'y axis')
            .attr('transform', 'translate(' + chart.left() + ',0)')
            .call(yAxis);

        selection.append('g').attr('class', 'x axis')
            .attr('transform', 'translate(0,' + chart.xAxisTop() + ')')
            .call(xAxis);
    }

    chart.colors = function(value){
        if(!arguments.length){
            return _color.range();
        }
        _color.range(value).interpolate(d3.interpolateHsl);
        return chart;
    };

    accessor.call(chart, 'width', 1280);
    accessor.call(chart, 'top', 75);
    accessor.call(chart, 'left', 96);
    accessor.call(chart, 'right', 0);
    accessor.call(chart, 'xAxisTop', 315);

    return chart;
};
