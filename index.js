var d3 = require('d3'),
    dot = require('./charts/dot').dot;


window.addEventListener('load', function(){
    var data1 = [['Category 1', 53],
                ['Category 2', 23],
                ['Category 3', 100],
                ['Category 4', 44],
                ['Category 5', 87]],
        data2 = [['Category 1', 53],
                ['Category 2', 23],
                ['Category 3', 100],
                ['Category 4', 87]],
        colors = [
            '#65ffff',
            '#9966ff',
            '#fecd66',
            '#ff7e66',
            '#e0ff65',
        ];

    d3.select('body')
        .append('svg')
        .style('width', '50%')
        .datum(data1)
        .call(dot().colors(colors));

    d3.select('body')
        .append('svg')
        .style('width', '50%')
        .datum(data2)
        .call(dot());

    var animatedChart = d3.select('body').append('svg');

    setInterval(function(){
        data3 = [1, 2, 3, 4].map(function(n){
            return ['Category ' + n , Math.floor(Math.random() * 100)];
        });
        animatedChart.datum(data3).call(dot());
    }, 2000);
});
