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

function ceil(value){
    return Math.ceil(value/100) * 100;
}

exports.dot = function(colors){
    var width = 1280,
        top = 75,
        left = 165,
        right = 190,
        xAxisTop = 315,
        _color = d3.scale.linear()
                    .range(['hsl(0, 100%, 60%)', 'hsl(360, 100%, 60%)'])
                    .interpolate(d3.interpolateString);

    function chart(selection){
        var data = selection.datum(),
            max = ceil(d3.max(data, value)),
            categories = data.map(category),
            x = d3.scale.ordinal().domain(categories).rangeBands([left, width - right], 0.3, 0.5),
            y = d3.scale.linear().domain([0, max]).range([xAxisTop, top]),
            yTickSize = y.range()[1] - y.range()[0],
            xAxis = d3.svg.axis().scale(x).tickPadding(45),
            yAxis = d3.svg.axis().scale(y).orient('left').ticks(4);

            if(_color.range().length === 2){
                _color.domain([0, categories.length]);
            }else{
                _color.domain(d3.range(categories.length));
            }

        selection.classed('nyan-chart-dot', true)
            .attr('viewBox', '0 0 ' + width + ' 515')
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
                    middleStop = (y(value(d)) + margin),
                    middleStart = Math.max(y(value(d)) - margin, y.range()[1]);
                return ('M' + xPos + ',' + y.range()[0] +
                        'V' + middleStop  +
                        'M' + xPos + ',' + middleStart +
                        'V' + y.range()[1]);
            });

        selection.append('path')
            .attr('class', 'baloon')
            .attr('d', function(d){
                var height = 100,
                    arrow = height * 0.1,
                    width = 300;
                return ('M0,' + height/2 +
                        'l' + arrow + ',' + (-arrow) +
                        'V0' +
                        'H' + width +
                        'V' + height +
                        'H' + arrow +
                        'V' + (height/2 + arrow) +
                        'Z');
            });


        var onEnter = selection.selectAll('circle')
            .data(data)
            .enter();

        onEnter.append('circle')
            .attr('class', 'point')
            .attr('r', '6')
            .attr('cy', c(y, value))
            .attr('cx', c(inc(x.rangeBand()/2), x, category));

        onEnter.append('text')
            .attr('x', c(inc(x.rangeBand()/2), x, category))
            .attr('dx', '1.5em')
            .attr('dy', '0.3em')
            .attr('y', c(y, value))
            .text(value);

        selection.append('g').attr('class', 'y axis')
            .attr('transform', 'translate(' + left + ',0)')
            .call(yAxis);

        selection.append('g').attr('class', 'x axis')
            .attr('transform', 'translate(0,' + xAxisTop + ')')
            .call(xAxis);

    }

    chart.colors = function(value){
        if(!arguments.length){
            return _color.range();
        }
        _color.range(value).interpolate(d3.interpolateHsl);
        return chart;
    };

    return chart;
};
