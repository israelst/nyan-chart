var d3 = require('d3'),
    util = require('../util'),
    accessor = util.accessor,
    inc = util.inc,
    index = util.arg(1),
    c = util.c,
    p = util.p,
    balloon = require('./balloon'),
    rainbow = require('./rainbow').rainbow,
    wordWrapping = require('./axis').wordWrapping;

function ceil(value){
    return Math.ceil(value/100) * 100;
}

function transitionConfig(transition){
    transition.duration(1000).ease('exp-out');
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
            var mySpots = chart.rainbow()(x, y, data, transitionConfig);
            mySpots
                .color(_color)
                .category(category)
                .value(value);
            selection.call(mySpots);
        }

        selection.select('g.holeTicks')
            .selectAll('path.ticks')
            .data(data, chart.category())
            .enter()
            .append('path')
            .attr('d', function(d){ return holeTicks(category(d), y.domain()[0]); })
            .attr('class', 'ticks');

        function holeTicks(vX, vY){
            var xPos = +c(inc(x.rangeBand()/2), x)(vX),
            margin = 12,
            middleStop = Math.min(y(vY) + margin, y.range()[0]),
            middleStart = Math.max(y(vY) - margin, y.range()[1]);
            return ('M' + xPos + ',' + y.range()[0] +
                    'V' + middleStop  +
                    'M' + xPos + ',' + middleStart +
                    'V' + y.range()[1]);
        }

        selection.selectAll('g.holeTicks path.ticks')
            .transition()
            .call(transitionConfig)
            .attr('d', function(d){ return holeTicks(category(d), value(d)); });


        var pointsContainer = selection.select('g.points');
        pointsContainer.selectAll('g.point')
            .data(data, chart.category())
            .enter()
            .append('g')
            .attr('class', 'point')
            .attr('transform', function(d){
                var dx = c(inc(x.rangeBand()/2), x, category)(d);
                return 'translate(' + dx + ',' + y.range()[0] + ')';
            })
            .append('circle').attr('r', 6);

        var points = pointsContainer.selectAll('g.point');

        points.call(
            balloon.tooltip(c(yAxis.tickFormat(), value),
                            c(_color, index),
                            transitionConfig));
        points
            .transition()
            .call(transitionConfig)
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

    addAttr('width', selection.node().parentNode.clientWidth);
    addAttr('top', 75);
    addAttr('left', 96);
    addAttr('right', 0);
    addAttr('xAxisTop', 315);
    addAttr('valueFormat', d3.format("n"));
    addAttr('rainbow', rainbow);
    addAttr('data');

    addAttr('category', p(0));
    addAttr('value', p(1));

    return chart;
};
