var d3 = require('d3'),
    util = require('../util'),
    inc = util.inc,
    index = util.arg(1),
    c = util.c,
    accessor = util.accessor,
    balloon = require('./balloon'),
    rainbow = require('./rainbow').rainbow,
    wordWrapping = require('./axis').wordWrapping;

function ceil(value){
    return Math.ceil(value/100) * 100;
}

exports.dot = function(selection){
    var _color = d3.scale.linear()
                    .range(['hsl(0, 100%, 60%)', 'hsl(360, 100%, 60%)'])
                    .interpolate(d3.interpolateString);


    selection.append('defs');
    selection.append('g').attr('class', 'spots');
    selection.append('g').attr('class', 'holeTicks');
    selection.append('g').attr('class', 'points');
    selection.append('g').attr('class', 'y axis');
    selection.append('g').attr('class', 'x axis');

    function chart(){
        var data = chart.data(),
            category = chart.category(),
            value = chart.value(),
            max = ceil(d3.max(data, value)),
            categories = data.map(category),
            x = d3.scale.ordinal().domain(categories).rangeBands([chart.left(), chart.width() - chart.right()], 0.1, 0.5),
            y = d3.scale.linear().domain([0, max]).range([chart.xAxisTop(), chart.top()]).clamp(true),
            xAxis = wordWrapping().scale(x).tickPadding(45),
            yAxis = d3.svg.axis()
                .scale(y)
                .orient('left')
                .tickValues(d3.range(0, max + 1, max/4))
                .tickFormat(chart.valueFormat());

            if(_color.range().length === 2){
                _color.domain([0, categories.length]);
            }else{
                _color.domain(d3.range(categories.length));
            }

        selection.classed('nyan-chart-dot', true)
            .attr('viewBox', '0 0 ' + chart.width() + ' 515')
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .attr('width', '100%');

        if(chart.rainbow()){
            selection.call(chart.rainbow()(x, y, _color, category, value, data));
        }

        selection.select('g.holeTicks')
            .selectAll('path.ticks')
            .data(data, chart.category())
            .enter()
            .append('path')
            .attr('class', 'ticks');

        selection.selectAll('g.holeTicks path.ticks')
            .transition()
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


        var points = selection.select('g.points');
        points.selectAll('g.point')
            .data(data, chart.category())
            .enter()
            .append('g')
            .attr('class', 'point')
            .attr('transform', function(d){
                var dx = c(inc(x.rangeBand()/2), x, category)(d);
                return 'translate(' + dx + ',' + y(0) + ')';
            })
            .append('circle').attr('r', 6);

        points.selectAll('g.point').call(
            balloon.tooltip(c(yAxis.tickFormat(), value),
                            c(_color, index)));
        points.selectAll('g.point')
            .transition()
            .attr('transform', function(d){
                var dx = c(inc(x.rangeBand()/2), x, category)(d),
                    dy = c(y, value)(d);
                return 'translate(' + dx + ',' + dy + ')';
            });

        selection.select('g.y.axis')
            .attr('transform', 'translate(' + chart.left() + ',0)')
            .call(yAxis);

        selection.select('g.x.axis')
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

    var addAttr = accessor.bind(chart);
    addAttr('width', 1280);
    addAttr('top', 75);
    addAttr('left', 96);
    addAttr('right', 0);
    addAttr('xAxisTop', 315);
    addAttr('valueFormat', d3.format("n"));
    addAttr('rainbow', rainbow);
    addAttr('data');

    addAttr('category', function (d){ return d[0];});
    addAttr('value', function (d){ return d[1];});

    return chart;
};
