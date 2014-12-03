var d3 = require('d3'),
    dot = require('./charts/dot').dot;

window.addEventListener('load', function(){
    var data = [['Category 1', 100],
                ['Category 2', 87],
                ['Category 3', 53],
                ['Category 4', 44],
                ['Category 5', 23]],
        chart = dot();

    d3.select('body')
        .append('svg')
        .attr('id', 'dot')
        .datum(data)
        .call(chart);
});
